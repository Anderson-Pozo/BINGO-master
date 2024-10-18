import { genConst } from 'store/constant';

export const uiStyles = {
  appbar: { borderRadius: 15, height: 60, backgroundColor: genConst.CONST_APPBAR },
  container: { marginTop: 0 },
  box: { flexGrow: 1, display: { xs: 'flex', md: 'none' } },
  box1: { width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 },
  box2: { flexGrow: 1, display: { xs: 'none', md: 'flex' } },
  menu: { display: { xs: 'block', md: 'none' } },
  paper: { width: '100%', overflow: 'hidden', marginTop: 2 },
  editButton: { backgroundColor: '#010066' },
  deleteButton: { backgroundColor: '#d8281c' },
  modalStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 500
    },
    '@media (max-width: 718px)': {
      width: 500
    },
    '@media (max-width: 619px)': {
      width: 500
    },
    '@media (max-width: 508px)': {
      width: 450
    },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 6,
    boxShadow: 24,
    p: 4
  },
  styleDelete: {
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
    boxShadow: 24,
    p: 4
  },
  styleLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 80,
    height: 80,
    bgcolor: 'transparent',
    border: 'none',
    borderRadius: 6,
    boxShadow: 0,
    p: 4
  }
};
