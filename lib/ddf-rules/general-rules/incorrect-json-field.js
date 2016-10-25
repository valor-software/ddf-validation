'use strict';

const _ = require('lodash');
const registry = require('../registry');
const Issue = require('../issue');

function charCount(string, chars) {
  return chars.reduce((res, ch) => {
    res[ch] = string.split(ch).length - 1;
    return res;
  }, {});
}

function isJsonLike(str) {
  if (_.isEmpty(str)) {
    return false;
  }

  const charCounts = charCount(str, ['[', ']', '{', '}']);

  function squareBrackets() {
    return charCounts['['] > 0 && charCounts['['] === charCounts[']'];
  }

  function braces() {
    return charCounts['{'] > 0 && charCounts['{'] === charCounts['}'];
  }

  return squareBrackets() || braces();
}

function detectColumnsHavingJson(ddfDataSet) {
  const conceptDataByFiles = ddfDataSet.getConcept().getDataByFiles();
  const entityDataByFiles = ddfDataSet.getEntity().getDataByFiles();
  const dataByFiles = _.extend(conceptDataByFiles, entityDataByFiles);
  const serviceFields = ['$$source', '$$lineNumber', 'meta', '$loki'];
  const result = {};

  Object.keys(dataByFiles).forEach(fileName => {
    const columnNames = Object.keys(_.head(dataByFiles[fileName]))
      .filter(key => !_.includes(serviceFields, key));
    const jsonColumns = [];

    columnNames.forEach(column => {
      let isNotLikeJson = false;

      dataByFiles[fileName].forEach(record => {
        if (!isJsonLike(record[column]) && record[column]) {
          isNotLikeJson = true;
        }
      });

      if (!isNotLikeJson) {
        jsonColumns.push(column);
      }
    });

    result[fileName] = jsonColumns;
  });

  return result;
}

function correctBoolean(json) {
  return json.replace(/true|false/ig, booleanValue => booleanValue.toLowerCase());
}

function ensureJsonIsSafe(json) {
  return json.replace(/\)[;\n]/g, '');
}

function correctJSON(wrongJSON) {
  let result = null;

  /*eslint-disable no-new-func */

  try {
    const convertFun = new Function(`return JSON.stringify(${ensureJsonIsSafe(correctBoolean(wrongJSON))})`);

    result = convertFun();
  } catch (ex) {
    result = null;
  }

  /*eslint-enable no-new-func */

  return result;
}

function isValidJSON(json) {
  let result = true;

  try {
    JSON.parse(json);
  } catch (ex) {
    result = false;
  }

  return result;
}


function isCorrectionPossible(record, column, fileName) {
  return record[column] && record.$$source === fileName && !isValidJSON(record[column]);
}

function getIncorrectJsonIssues(ddfDataSet, ddfDataWrapper) {
  const result = [];
  const columnsHavingJson = detectColumnsHavingJson(ddfDataSet);

  ddfDataWrapper.getAllData().forEach(conceptRecord => {
    Object.keys(columnsHavingJson).forEach(fileName => {
      columnsHavingJson[fileName].forEach(jsonColumn => {
        if (isCorrectionPossible(conceptRecord, jsonColumn, fileName)) {
          const data = {
            column: jsonColumn,
            line: conceptRecord.$$lineNumber + 1,
            value: conceptRecord[jsonColumn]
          };
          const correctedJSON = correctJSON(conceptRecord[jsonColumn]);
          const issue = new Issue(registry.INCORRECT_JSON_FIELD)
            .setPath(conceptRecord.$$source)
            .setData(data);

          if (correctedJSON) {
            issue.setSuggestions([correctedJSON]);
          }

          result.push(issue);
        }
      });
    });
  });

  return result;
}

module.exports = {
  rule: ddfDataSet =>
    getIncorrectJsonIssues(ddfDataSet, ddfDataSet.getConcept())
      .concat(getIncorrectJsonIssues(ddfDataSet, ddfDataSet.getEntity()))
};