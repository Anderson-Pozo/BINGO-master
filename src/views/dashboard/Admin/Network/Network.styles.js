import { genConst } from 'store/constant';

export const uiStyles = {
  appbar: { borderRadius: 15, height: 60, backgroundColor: genConst.CONST_APPBAR },
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
  imagePic: { width: 50, height: 50, borderRadius: '50%' },
  stateActive: { marginTop: -10, color: '#5ABD7C', fontSize: 12 },
  stateNoActive: { marginTop: -10, color: '#EB635D', fontSize: 12 },
  name: { marginTop: 2, fontSize: 11 },
  email: { marginTop: -10, fontSize: 11 },
  btn: { width: 140 }
};
