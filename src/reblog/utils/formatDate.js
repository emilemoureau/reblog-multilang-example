const formatDate = (date, lang) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };

  return new Intl.DateTimeFormat(lang, options).format(new Date(date));
};

export { formatDate}