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
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { uiStyles } from './Benefits.styles';
//Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Collections
import { titles } from './Benefits.texts';
//Utils
import { getAllUserBenefits, getBenefits, getTotalBenefit } from 'config/firebaseEvents';
//types array
import MessageDark from 'components/message/MessageDark';
import EarningCard from 'components/cards/EarningCard';
import EarningBlueCard from 'components/cards/EarningBlueCard';
import { genConst } from 'store/constant';
import EarningRedCard from 'components/cards/EarningRedCard';
import EarningGreenCard from 'components/cards/EarningGreenCard';

export default function Benefits() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [dataListUsr, setDataListUsr] = useState([]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getData = async () => {
    getBenefits().then((res) => {
      setDataList(res);
    });
    getAllUserBenefits().then((res) => {
      setDataListUsr(res);
    });
    getTotalBenefit().then((res) => {
      setTotal(res);
    });
  };

  useEffect(() => {
    getData();
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
      {dataList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <Grid container spacing={1} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={3} md={6} sm={6} xs={6}>
                  <EarningCard total={total} detail="Ingresos" />
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={6}>
                  <EarningBlueCard total={0} detail="Beneficio" />
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={6}>
                  <EarningGreenCard total={0} detail="Pagado" />
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={6}>
                  <EarningRedCard total={0} detail="Pendiente" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Beneficio Khuska" />
                <Tab label="Beneficios Usuarios" />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="id-createAt" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                        {'Fecha'}
                      </TableCell>
                      <TableCell key="id-name" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {'De'}
                      </TableCell>
                      <TableCell key="id-email" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {'Email'}
                      </TableCell>
                      <TableCell key="id-idUser" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {'Usuario'}
                      </TableCell>
                      <TableCell key="id-total" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                        {'Total'}
                      </TableCell>
                      <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                        {titles.actions}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                      <TableRow hover key={r.id}>
                        <TableCell align="left">{r.createAt}</TableCell>
                        <TableCell align="left">{r.name + ' ' + r.lastName}</TableCell>
                        <TableCell align="left">{r.email}</TableCell>
                        <TableCell align="left">{r.idUser}</TableCell>
                        <TableCell align="left">{r.total.toFixed(2)}</TableCell>
                        <TableCell align="center"></TableCell>
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
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="id-createAt" align="left" style={{ minWidth: 150, fontWeight: 'bold' }}>
                        {'Fecha'}
                      </TableCell>
                      <TableCell key="id-name" align="left" style={{ minWidth: 150, fontWeight: 'bold' }}>
                        {'Nombre'}
                      </TableCell>
                      <TableCell key="id-email" align="left" style={{ minWidth: 150, fontWeight: 'bold' }}>
                        {'Email'}
                      </TableCell>
                      <TableCell key="id-idUser" align="left" style={{ minWidth: 150, fontWeight: 'bold' }}>
                        {'Para'}
                      </TableCell>
                      <TableCell key="id-total" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {'Total'}
                      </TableCell>
                      <TableCell key="id-total" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                        {'Estado'}
                      </TableCell>
                      <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                        {titles.actions}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataListUsr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                      <TableRow hover key={r.id}>
                        <TableCell align="left">{r.date}</TableCell>
                        <TableCell align="left">{r.name + ' ' + r.lastName}</TableCell>
                        <TableCell align="left">{r.email}</TableCell>
                        <TableCell align="left">{r.emailRefer}</TableCell>
                        <TableCell align="left">{r.total.toFixed(2)}</TableCell>
                        <TableCell align="left">
                          {r.state == genConst.CONST_BEN_CAN ? 'Cancelado' : r.state == genConst.CONST_BEN_PAI ? 'Pagado' : 'Pendiente'}
                        </TableCell>
                        <TableCell align="center"></TableCell>
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
            </CustomTabPanel>
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
    </div>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};
