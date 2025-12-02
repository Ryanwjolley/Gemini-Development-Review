/*

const { Client } = require('@elastic/elasticsearch')
const host = process.env.ELASTICSEARCH_HOST
// const someIndex = process.env.ELASTICSEARCH_PROJECTS_INDEX

const elastic = new Client({ node: host })
// let elastic = new Client({ node: 'http://localhost:9200' })
// 👆 when testing locally I had set xpack.security properties to false
// in the elasticsearch.yml file that comes with elasticsearch download
// so this could work without username/pass and such. The default when
// downloading elasticsearch 8.3.3 had all that security stuff enabled

module.exports = elastic
*/
