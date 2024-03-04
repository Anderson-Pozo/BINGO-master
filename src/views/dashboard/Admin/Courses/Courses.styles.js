import { genConst } from 'store/constant';

export const uiStyles = {
  appbar: { borderRadius: 10, height: 60, backgroundColor: genConst.CONST_APPBAR },
  appbarSearch: { borderRadius: 10, height: 80, backgroundColor: genConst.CONST_APPBAR_SEARCH },
  container: { marginTop: 0 },
  containerAdd: { marginTop: -5 },
  box: { flexGrow: 1, display: { xs: 'flex', md: 'none' } },
  box2: { flexGrow: 1, display: { xs: 'none', md: 'flex' } },
  menu: { display: { xs: 'block', md: 'none' } },
  paper: { width: '100%', overflow: 'hidden', marginTop: 2 },
  paperAddUser: { width: '100%', overflow: 'hidden', marginTop: 2 },
  title: { marginLeft: 10, marginRight: 10, fontSize: 18, fontWeight: 'bold' },
  createButtonAppbar: { margin: 0, backgroundColor: '#2DCA9D', color: '#FFF', borderRadius: 15 },
  createButton: { margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CREATE_COLOR },
  updateButton: { margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_UPDATE_COLOR },
  appbarUpdateButton: { margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_UPDATE_COLOR },
  deleteButton: { margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_DELETE_COLOR },
  cancelButton: { margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CANCEL_COLOR },
  fileButton: { backgroundColor: genConst.CONST_UPDATE_COLOR, borderRadius: 10, width: '100%', margin: 2 },
  videoButton: { backgroundColor: genConst.CONST_ERROR_COLOR, borderRadius: 10, width: '100%', margin: 2 },
  editGroupButton: { backgroundColor: '#2DC3F7' },
  deleteGroupButton: { backgroundColor: '#FF5656' },
  modalDeleteTitle: { marginTop: 20, fontSize: 16 },
  openIcon: { width: 16, color: '#2DCA9D' },
  editIcon: { width: 16, color: '#2DC3F7' },
  userIcon: { width: 16, color: '#2DC3F7' },
  deleteIcon: { width: 16, color: '#FF5656' },
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
      width: 380
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
      width: 350
    },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 6,
    boxShadow: 24,
    p: 4
  },
  modalVideo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 800,
      height: 530
    },
    '@media (max-width: 718px)': {
      width: 600,
      height: 400
    },
    '@media (max-width: 619px)': {
      width: 500,
      height: 300
    },
    '@media (max-width: 508px)': {
      width: 450,
      height: 300
    },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 6,
    boxShadow: 24,
    p: 2
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
