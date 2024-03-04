import React, { useEffect, useState } from 'react';
//Firebase
import { authentication, db } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { collUsers } from 'store/collections';
import { genConst, gridSpacing } from 'store/constant';
import SubscriptionState from 'components/message/SubscriptionState';
//Custom Hook
import { useGetSubscriptionState } from 'hooks/useGetSubscriptionState';
import { msgSubState } from 'store/message';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Title from 'components/message/Title';
import NetworkChild from './NetworkChild';
import { titles } from './Network.texts';
import { uiStyles } from './Network.styles';

const Network = () => {
  //Lists
  const [childsList, setChildsList] = useState([]);
  const [childsListL2, setChildsListL2] = useState([]);
  const [childsListL3, setChildsListL3] = useState([]);
  const [childsListL4, setChildsListL4] = useState([]);
  //Visibility Levels
  const [showL2, setShowL2] = React.useState(false);
  const [showL3, setShowL3] = React.useState(false);
  const [showL4, setShowL4] = React.useState(false);
  //Variables
  const [userRefer, setUserRefer] = useState(null);
  const [userState, setUserState] = useState(null);
  const [utlAvatar, setUrlAvatar] = useState(null);
  const [open, setOpen] = React.useState(false);
  const stateSub = useGetSubscriptionState();

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setOpen(true);
        const q = query(collection(db, collUsers), where('id', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          setUserState(doc.data().state);
          setUserRefer(doc.data().ownReferal);
          setUrlAvatar(doc.data().avatar);
          const childs = [];
          const q = query(collection(db, collUsers), where('refer', '==', doc.data().ownReferal));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
              childs.push(doc.data());
            });
            setChildsList(childs);
            setChildsListL2([]);
            setChildsListL3([]);
            setChildsListL4([]);
            setShowL2(false);
            setShowL3(false);
            setShowL4(false);
          } else {
            setChildsListL2([]);
            setChildsListL3([]);
            setChildsListL4([]);
            setShowL2(false);
            setShowL3(false);
            setShowL4(false);
          }
        });
      }
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    });
  }, []);

  const childsLevel2 = async (code) => {
    const childs = [];
    const q = query(collection(db, collUsers), where('refer', '==', code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        childs.push(doc.data());
      });
      setChildsListL2(childs);
      setChildsListL3([]);
      setChildsListL4([]);
      setShowL2(true);
      setShowL3(false);
      setShowL4(false);
    } else {
      setShowL2(false);
      setShowL3(false);
      setShowL4(false);
      setChildsListL3([]);
      setChildsListL4([]);
    }
  };
  const childsLevel3 = async (code) => {
    const childs = [];
    const q = query(collection(db, collUsers), where('refer', '==', code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        childs.push(doc.data());
      });
      setChildsListL3(childs);
      setChildsListL4([]);
      setShowL3(true);
      setShowL4(false);
    } else {
      setShowL3(false);
      setShowL4(false);
    }
  };
  const childsLevel4 = async (code) => {
    setShowL4(true);
    const childs = [];
    const q = query(collection(db, collUsers), where('refer', '==', code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        childs.push(doc.data());
      });
      setChildsListL4(childs);
      setShowL4(true);
    } else {
      setShowL4(false);
    }
  };

  return (
    <div>
      {stateSub == genConst.CONST_SUB_STATE_ACTIVE ? (
        <>
          <Title message={titles.title} submessage={titles.ref + userRefer} avatar={utlAvatar} />
          <div hidden>{userState}</div>
          <Box>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h4">{titles.level1}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {childsList.map((child, key) => (
                            <TableCell key={key}>
                              <Button variant="outlined" onClick={() => childsLevel2(child.ownReferal)} style={uiStyles.btn}>
                                <NetworkChild
                                  avatar={child.avatar}
                                  name={child.name}
                                  lastName={child.lastName}
                                  email={child.email}
                                  state={child.state}
                                />
                              </Button>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {showL2 ? (
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography variant="h4">{titles.level2}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {childsListL2.map((child, key) => (
                              <TableCell key={key}>
                                <Button variant="outlined" onClick={() => childsLevel3(child.ownReferal)} style={uiStyles.btn}>
                                  <NetworkChild
                                    avatar={child.avatar}
                                    name={child.name}
                                    lastName={child.lastName}
                                    email={child.email}
                                    state={child.state}
                                  />
                                </Button>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                ) : (
                  <></>
                )}
                {showL3 ? (
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography variant="h4">{titles.level3}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {childsListL3.map((child, key) => (
                              <TableCell key={key}>
                                <Button variant="outlined" onClick={() => childsLevel4(child.ownReferal)} style={uiStyles.btn}>
                                  <NetworkChild
                                    avatar={child.avatar}
                                    name={child.name}
                                    lastName={child.lastName}
                                    email={child.email}
                                    state={child.state}
                                  />
                                </Button>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                ) : (
                  <></>
                )}
                {showL4 ? (
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography variant="h4">{titles.level4}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {childsListL4.map((child, key) => (
                              <TableCell key={key}>
                                <Button variant="outlined" style={uiStyles.btn}>
                                  <NetworkChild
                                    avatar={child.avatar}
                                    name={child.name}
                                    lastName={child.lastName}
                                    email={child.email}
                                    state={child.state}
                                  />
                                </Button>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <Grid container spacing={gridSpacing}>
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
};

export default Network;
