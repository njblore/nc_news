const convertDate = arr => {
  let arrCopy = [...arr];
  for (let obj of arrCopy) {
    const epochTime = obj.created_at;
    const isoTime = new Date(epochTime).toISOString();
    obj.created_at = isoTime;
  }
  return arrCopy;
};

const createArticleRef = arr => {
  let refObj = {};
  for (let item of arr) {
    refObj[item.title] = item.article_id;
  }
  return refObj;
};

const formatComments = (arr, ref) => {
  let newArr = [];
  for (let obj of arr) {
    let objCopy = { ...obj };
    objCopy.article_id = ref[objCopy.belongs_to];
    delete objCopy.belongs_to;
    newArr.push(objCopy);
  }

  return newArr;
};

module.exports = { convertDate, createArticleRef, formatComments };
