const convertDate = arr => {
  let arrCopy = [...arr];
  for (let obj of arrCopy) {
    const epochTime = obj.created_at;
    const isoTime = new Date(epochTime).toISOString();
    obj.created_at = isoTime;
  }
  return arrCopy;
};

module.exports = { convertDate };
