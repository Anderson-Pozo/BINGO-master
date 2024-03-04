import { genConst } from 'store/constant';

export const uiStyles = {
  appbar: { borderRadius: 15, height: 60, backgroundColor: genConst.CONST_APPBAR },
  container: { marginTop: -12 },
  box: { flexGrow: 1, display: { xs: 'flex', md: 'none' } },
  box2: { flexGrow: 1, display: { xs: 'none', md: 'flex' } },
  menu: { display: { xs: 'block', md: 'none' } },
  paper: { width: '100%', overflow: 'hidden', marginTop: 2 },
  createButton: { margin: 5, backgroundColor: '#2DC3F7', color: '#FFF', border: 'none', borderRadius: 15, height: 50 },
  editButton: { margin: 5, backgroundColor: '#2DC3F7', color: '#FFF', border: 'none', borderRadius: 15, height: 50 },
  deleteButton: { margin: 5, backgroundColor: '#FF5656', color: '#FFF', border: 'none', borderRadius: 15, height: 50 },
  cancelButton: { margin: 5, backgroundColor: '#909090', color: '#FFF', border: 'none', borderRadius: 15, height: 50 },
  editGroupButton: { backgroundColor: '#2DC3F7' },
  deleteGroupButton: { backgroundColor: '#FF5656' },
  modalDeleteTitle: { marginTop: 20, fontSize: 16 },
  modalStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 700
    },
    '@media (max-width: 718px)': {
      width: 600
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
  modalLoader: {
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
