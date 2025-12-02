module.exports = s =>
  s.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
