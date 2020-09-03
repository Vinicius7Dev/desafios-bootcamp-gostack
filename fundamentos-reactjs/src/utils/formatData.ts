const formatData = (date: string): string => {
    const [onlyDate, ] = date.split('T');
    const [year, month, day] = onlyDate.split('-');
    
    return `${day}/${month}/${year}`;
}
export default formatData;