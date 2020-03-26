const approot = require('app-root-path');
const path = require('path');
const esService = require(`${approot}/util/elasticsearch.service.js`);
const indexName = 'member';
const docType = '_doc';
let payload = {};


module.exports = {

  login: async (userId, userPw) => {
    payload = {
      "query": {
        "bool": {
          "must": [{
              "match": {
                "id.keyword": userId
              }
            },
            {
              "match": {
                "pwd.keyword": userPw
              }
            }
          ]
        }
      }
    };
    try {
      const result = await esService.search(indexName, docType, payload);
      return result;
    } catch (err) {
      throw err;
    }
  },


  idCheck: async (data) => {
    payload = {
      "query": {
              "match": {
                "id.keyword": data
              }
      }
    };
    try {
      const result = await esService.search(indexName, docType, payload);
      return result;
    } catch (err) {
      throw err;
    }
  },

  join: async (data) => {
    payload = {
      id: data.userId,
      pwd: data.userPw,
      name:data.userName,
      email:data.userEmail
    };
    try {
      const result = await esService.addDocument(indexName, payload.id, docType, payload);

      return result;
    } catch (err) {
      throw err;
    }
  },
  reJoin: async (data) => {
    payload = {
      id: data.userId,
      pwd: data.userPw,
      name:data.userName,
      email:data.userEmail
    };
    try {
      const result = await esService.addDocument(indexName, payload.id, docType, payload);

      return result;
    } catch (err) {
      throw err;
    }
  },
  findId: async (data) => {
    payload = {
      "query": {
        "bool": {
          "must": [{
              "match": {
                "name.keyword": data.userName
              }
            },
            {
              "match": {
                "email.keyword": data.userEmail
              }
            }
          ]
        }
      }
    };
    try {
      const result = await esService.search(indexName, docType, payload);

      return result;
    } catch (err) {
      throw err;
    }
  },
  findPw: async (data) => {
    payload = {
      "query": {
        "bool": {
          "must": [{
              "match": {
                "id.keyword": data.userId
              }
            },
            {
              "match": {
                "email.keyword": data.userEmail
              }
            }
          ]
        }
      }
    };
    try {
      const result = await esService.search(indexName, docType, payload);

      return result;
    } catch (err) {
      throw err;
    }
  },
  rePassword: async (data) => {
    payload = {
      id: data.userId,
      pwd: data.userPw,
      name:data.userName,
      email:data.userEmail
    };
    try {
      const result = await esService.addDocument(indexName, payload.id, docType, payload);

      return result;
    } catch (err) {
      throw err;
    }
  },


};