import generateDatasetStyle from './generateDatasetStyle';
import SETTINGS from '../../settings';

const sortByDate = (a, b) => {
    return new Date(b.submission_date) - new Date(a.submission_date);
  };

const dataToChartJSformat = data => data.map(({ submission_date, value }) => ({
      x: submission_date,
      y: value,
}));

const redashFormatter = (data, dataKeyIdentifier) => {
    const queryResulset = data.query_result;
    // Separate data points into buckets
    const buckets = queryResulset.data.rows.reduce((result, datum) => {
      const key = datum[dataKeyIdentifier];
      if (!key) {
        // XXX: Make it a custom error, catch it and display a UI message
        throw new Error('Check the Redash data and determine what is the key used to categorize the data.');
      }
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(datum);
      return result;
    }, {});
    const datasets = Object.keys(buckets).map((key, index) => {
      const datum = buckets[key];
      return {
        label: key,
        ...generateDatasetStyle(SETTINGS.colors[index]),
        data: dataToChartJSformat(datum.sort(sortByDate)),
      };
    });
    return { datasets };
};

export default redashFormatter;
