let txns = [];
let id = 0;

exports.addTxn = (amount, description, whoPaid, whoOwes) => {
  if (!amount || !description || !whoPaid || !whoOwes) {
    throw Error('null parameters');
  };
  txns = [...txns, {
    id: id,
    amount: amount,
    description: description,
    whoPaid: whoPaid,
    whoOwes: whoOwes,
  }];
  return id++;
};

exports.getAllTxns = () => txns;

exports.getTxn = (findId) => {
  if (!findId) {
    throw Error('null id');
  }
  return txns.filter(({id}) => id == findId)[0];
};

exports.deleteTxn = (findId) => {
  if (!findId || !txns.filter(({id}) => id == findId)) {
    throw Error('txn not found');
  }
  txns = txns.filter(({id}) => id != findId);
  return findId;
};

exports.updateTxn = (findId, updatedTxn) => {
  if (!findId || !txns.filter(({id}) => id == findId)) {
    throw Error('txn not found');
  }
  txns[findId] = {
    ...updatedTxn,
    id: id,
  };
  return id++;
};
