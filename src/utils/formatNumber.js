const formatNumber = (number) => {
  return parseFloat(number)
    .toFixed(2)
    .toString()
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default formatNumber;
