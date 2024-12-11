export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '@media (min-width: 718px)': {
    width: 400
  },
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: 6,
  boxShadow: 10,
  p: 4,
  maxWidth: '500px',
  maxHeight: '90vh',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  // '&::-webkit-scrollbar-thumb': {
  //   backgroundColor: '#888',
  //   borderRadius: '4px'
  // },
  // '&::-webkit-scrollbar-thumb:hover': {
  //   backgroundColor: '#555'
  // },
  '&::-webkit-scrollbar-track': {
    borderRadius: '4px',
    border: 'none',
    background: 'transparent'
  }
};
