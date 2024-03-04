/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Grid,
  Box,
  CircularProgress,
  Modal
} from '@mui/material';
import { uiStyles } from './Benefits.styles';
//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Collections
import { titles } from './Benefits.texts';
//Utils
import {
  getTotalCancelBenefitByUserId,
  getTotalPaidBenefitByUserId,
  getTotalPendinBenefitByUserId,
  getUserBenefits
} from 'config/firebaseEvents';
import { useGetSubscriptionState } from 'hooks/useGetSubscriptionState';
import SubscriptionState from 'components/message/SubscriptionState';
//types array
import MessageDark from 'components/message/MessageDark';
import { genConst } from 'store/constant';
import EarningBlueCard from 'components/cards/EarningBlueCard';
import EarningRedCard from 'components/cards/EarningRedCard';
import EarningYellowCard from 'components/cards/EaringYellowCard';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import { msgSubState } from 'store/message';

export default function Benefits() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalC, setTotalC] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [totalPN, setTotalPN] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const stateSub = useGetSubscriptionState();

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setOpen(true);
        getUserBenefits(user.uid).then((res) => {
          setDataList(res);
        });
        getTotalCancelBenefitByUserId(user.uid).then((res) => {
          setTotalC(res);
        });
        getTotalPendinBenefitByUserId(user.uid).then((res) => {
          setTotalPN(res);
        });
        getTotalPaidBenefitByUserId(user.uid).then((res) => {
          setTotalP(res);
        });
      }
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <ToastContainer />
      {stateSub == genConst.CONST_SUB_STATE_ACTIVE ? (
        <>
          {dataList.length > 0 ? (
            <Paper sx={uiStyles.paper}>
              <Grid container spacing={1} sx={{ p: 2 }}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={4} md={4} sm={4} xs={4}>
                      <EarningBlueCard total={totalP} detail="Pagado" />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={4}>
                      <EarningYellowCard total={totalPN} detail="Pendiente" />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={4}>
                      <EarningRedCard total={totalC} detail="Cancelado" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box sx={{ width: '100%', mt: 2 }}>
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell key="id-createAt" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                          {'Fecha'}
                        </TableCell>
                        <TableCell key="id-name" align="left" style={{ minWidth: 150, fontWeight: 'bold' }}>
                          {'Usuario'}
                        </TableCell>
                        <TableCell key="id-email" align="left" style={{ minWidth: 150, fontWeight: 'bold' }}>
                          {'Email'}
                        </TableCell>
                        <TableCell key="id-total" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                          {'Total'}
                        </TableCell>
                        <TableCell key="id-state" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                          {'Estado'}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                        <TableRow hover key={r.id}>
                          <TableCell align="left">{r.date}</TableCell>
                          <TableCell align="left">{r.name + ' ' + r.lastName}</TableCell>
                          <TableCell align="left">{r.email}</TableCell>
                          <TableCell align="left">${r.total}</TableCell>
                          <TableCell align="left">
                            {r.state == genConst.CONST_BEN_CAN ? 'Cancelado' : r.state == genConst.CONST_BEN_PAI ? 'Pagado' : 'Pendiente'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  labelRowsPerPage={titles.rowsPerPage}
                  component="div"
                  count={dataList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </Paper>
          ) : (
            <Grid container style={{ marginTop: 20 }}>
              <Grid item xs={12}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <MessageDark message={titles.noRecordsYet} submessage="" />
                </Grid>
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SubscriptionState message={msgSubState} submessage={''} />
            </Grid>
          </Grid>
        </Grid>
      )}

      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.modalLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
}
