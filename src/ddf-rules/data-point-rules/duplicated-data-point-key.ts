import { uniq, difference } from 'lodash';
import { DUPLICATED_DATA_POINT_KEY } from '../registry';
import { Issue } from '../issue';

export const rule = {
  getStorageTemplate: () => ({
    hash: new Set(),
    duplicatedHashes: [],
    content: {}
  }),
  aggregateRecord: (dataPointDescriptor, storage) => {
    const sortedPrimaryKey = dataPointDescriptor.fileDescriptor.primaryKey.sort();
    const dimensionData = sortedPrimaryKey.map(keyPart => `${keyPart}:${dataPointDescriptor.record[keyPart]}`).join(',');
    const indicatorName = difference(dataPointDescriptor.fileDescriptor.headers, dataPointDescriptor.fileDescriptor.primaryKey).join(',');
    const recordHash = `${dimensionData}@${indicatorName}`;

    if (storage.hash.has(recordHash)) {
      storage.duplicatedHashes.push(recordHash);

      if (!storage.content[recordHash]) {
        storage.content[recordHash] = [];
      }

      storage.content[recordHash].push({
        file: dataPointDescriptor.fileDescriptor.file,
        record: dataPointDescriptor.record,
        line: dataPointDescriptor.line
      });
    }

    storage.hash.add(recordHash);
  },
  aggregativeRule: (storage) => {
    const duplicates: string[] = <string[]>uniq(storage.duplicatedHashes);
    const issues: Issue[] = [];

    for (const hash of duplicates) {
      issues.push(new Issue(DUPLICATED_DATA_POINT_KEY).setData(storage.content[hash]));
    }

    return issues;
  }
};
