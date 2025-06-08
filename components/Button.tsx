// Update styles
const textStyles = [
  styles.text,
  styles[`${size}Text`],
  {
    color: variant === 'outline' ? colors.text.primary : 
           variant === 'primary' && colors.primary === '#00FF00' ? '#000' : '#fff',
  },
  textStyle
];