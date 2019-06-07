import su from 'superagent';

export default (
  path,
  {
    method = 'GET',
    data = null,
    query = null,
    fields = null,
    headers = {},
  } = {},
) => {
  const request = su(method, path);

  request.set(headers);

  if (data) {
    request.send(data);
  }

  if (query) {
    request.query(query);
  }

  if (fields) {
    Object.keys(fields).map(key => {
      request.field(key, fields[key]);
    });
  }

  return new Promise((resolve, reject) => {
    request
      .then(res => {
        resolve(res.body);
      })
      .catch(err => {
        if (!err.response) {
          reject('networkIssue');
          return;
        }

        if (err.response.status === 401) {
          reject('unauthorized');
          return;
        }

        reject(err.response.body);
      });
  });
};
