"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Toolbar,
  Drawer,
  Divider,
  Paper,
  IconButton,
  InputBase,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import SearchIcon from "@mui/icons-material/Search";
import BlenderIcon from "@mui/icons-material/Blender";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [alertOpen, alertSetOpen] = useState(false);
  const [editAlertOpen, editAlertSetOpen] = useState(false);
  const [oldItemName, setOldItemName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);

    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  };

  const addItem = async (item, itemQuantity, itemUnit) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    // convert itemQuantity string to int
    const itemQuantityInt = parseInt(itemQuantity, 10);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: itemQuantityInt, unit: itemUnit });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }

    await updateInventory();
  };

  const editItem = async (oldItem, newItem, itemQuantity, itemUnit) => {
    try {
      const oldDocRef = doc(collection(firestore, "inventory"), oldItem);
      const oldDocSnap = await getDoc(oldDocRef);

      // convert itemQuantity string to int
      const itemQuantityInt = parseInt(itemQuantity, 10);

      if (oldDocSnap.exists()) {
        if (oldItem !== newItem) {
          const newDocRef = doc(collection(firestore, "inventory"), newItem);
          await setDoc(newDocRef, {
            name: newItem,
            quantity: itemQuantityInt,
            unit: itemUnit,
          });

          await deleteDoc(oldDocRef);
        } else {
          await updateDoc(oldDocRef, {
            quantity: itemQuantityInt,
            unit: itemUnit,
          });
        }
      }

      await updateInventory();
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    } else {
      return;
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleAlertOpen = () => {
    alertSetOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    alertSetOpen(false);
  };

  const handleEditAlertOpen = () => {
    editAlertSetOpen(true);
  };

  const handleEditAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    editAlertSetOpen(false);
  };

  const drawerWidth = 230;

  const handleSelectedIndex = (index) => {
    setSelectedIndex(index);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#F3F4FC", minHeight: "100vh" }}
    >
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#000747",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="20px"
          marginBottom="-40px"
          sx={{ color: "white" }}
        >
          iManager
        </Typography>
        <Toolbar />
        <List>
          {["Management", "Recipes"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ marginTop: 1, marginBottom: 1 }}
            >
              <Link
                href={index === 0 ? "/" : "/recipes"}
                passHref
                style={{
                  textDecoration: "none",
                  display: "block",
                  width: "100%",
                }}
              >
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "#9196C0",
                      borderRadius: "10px",
                    },
                    backgroundColor:
                      selectedIndex === index ? "#9196C0" : "transparent",
                    borderRadius: "10px",
                  }}
                  onClick={() => handleSelectedIndex(index)}
                >
                  <ListItemIcon>
                    {index === 0 ? (
                      <AppSettingsAltIcon sx={{ color: "white" }} />
                    ) : (
                      <BlenderIcon sx={{ color: "white" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ color: "white" }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box
          sx={{
            backgroundColor: "white",
            padding: 3,
            borderRadius: 1,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            maxWidth: "100vw",
            height: "100vh",
            maxHeight: "95vh",
            margin: "auto",
            marginTop: "-75px",
            marginBottom: "-10px",
          }}
          style={{
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              marginBottom={3}
              sx={{ color: "#000747" }}
            >
              Inventory Management
            </Typography>
            <Modal open={open}>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                width={400}
                bgcolor="white"
                p={4}
                display="flex"
                flexDirection="column"
                gap={3}
                sx={{
                  transform: "translate(-50%, -50%)",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  marginBottom="-10px"
                  sx={{ color: "#000747" }}
                >
                  Add New Item
                </Typography>
                <Typography
                  variant="h6"
                  marginTop="-5px"
                  fontSize="16px"
                  sx={{ color: "#7C7D83" }}
                >
                  Enter the details of the new item.
                </Typography>
                <Divider />
                <TextField
                  variant="outlined"
                  label="Name"
                  fullWidth
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
                <Stack width="100%" direction="row" spacing={2}>
                  <TextField
                    variant="outlined"
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={itemQuantity}
                    onChange={(e) => {
                      setItemQuantity(e.target.value);
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="unit-select-label">Unit(s)</InputLabel>
                    <Select
                      labelId="unit-select-label"
                      id="unit-select"
                      label="Unit(s)"
                      value={itemUnit}
                      onChange={(e) => {
                        setItemUnit(e.target.value);
                      }}
                    >
                      <MenuItem value="Ton (t)">Ton (t)</MenuItem>
                      <MenuItem value="Kilogram (kg)">Kilogram (kg)</MenuItem>
                      <MenuItem value="Gram (g)">Gram (g)</MenuItem>
                      <MenuItem value="Milligram (mg)">Milligram (mg)</MenuItem>
                      <MenuItem value="Pounds(lb)">Pound (lb)</MenuItem>
                      <MenuItem value="Ounce (oz)">Ounce (oz)</MenuItem>
                      <MenuItem value="Gallon (gal)">Gallon (gal)</MenuItem>
                      <MenuItem value="Quart (qt)">Quart (qt)</MenuItem>
                      <MenuItem value="Pint (pt)">Pint (pt)</MenuItem>
                      <MenuItem value="Cup (c)">Cup (c)</MenuItem>
                      <MenuItem value="Fluid ounce (fl oz)">
                        Fluid ounce (fl oz)
                      </MenuItem>
                      <MenuItem value="Tablespoon (tbsp)">
                        Tablespoon (tbsp)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack
                  width="100%"
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setItemName("");
                      setItemQuantity("");
                      setItemUnit("");

                      handleClose();
                    }}
                    sx={{
                      borderColor: "#000747",
                      "&:hover": {
                        borderColor: "#9196C0",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(itemName, itemQuantity, itemUnit);

                      setItemName("");
                      setItemQuantity("");
                      setItemUnit("");

                      handleClose();
                      handleAlertOpen();
                    }}
                    sx={{
                      backgroundColor: "#000747",
                      "&:hover": {
                        backgroundColor: "#9196C0",
                      },
                    }}
                  >
                    Confirm
                  </Button>
                </Stack>
              </Box>
            </Modal>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={alertOpen}
              autoHideDuration={3000}
              onClose={handleAlertClose}
            >
              <Alert
                onClose={handleAlertClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                Item added successfully!
              </Alert>
            </Snackbar>
            <Modal open={editOpen}>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                width={400}
                bgcolor="white"
                p={4}
                display="flex"
                flexDirection="column"
                gap={3}
                sx={{
                  transform: "translate(-50%, -50%)",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  marginBottom="-10px"
                  sx={{ color: "#000747" }}
                >
                  Edit Item
                </Typography>
                <Typography
                  variant="h6"
                  marginTop="-5px"
                  fontSize="16px"
                  sx={{ color: "#7C7D83" }}
                >
                  Enter the new details of this item.
                </Typography>
                <Divider />
                <TextField
                  variant="outlined"
                  label="Name"
                  fullWidth
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
                <Stack width="100%" direction="row" spacing={2}>
                  <TextField
                    variant="outlined"
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={itemQuantity}
                    onChange={(e) => {
                      setItemQuantity(e.target.value);
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="unit-select-label">Unit(s)</InputLabel>
                    <Select
                      labelId="unit-select-label"
                      id="unit-select"
                      label="Unit(s)"
                      value={itemUnit}
                      onChange={(e) => {
                        setItemUnit(e.target.value);
                      }}
                    >
                      <MenuItem value="Ton (t)">Ton (t)</MenuItem>
                      <MenuItem value="Kilogram (kg)">Kilogram (kg)</MenuItem>
                      <MenuItem value="Gram (g)">Gram (g)</MenuItem>
                      <MenuItem value="Milligram (mg)">Milligram (mg)</MenuItem>
                      <MenuItem value="Pounds(lb)">Pound (lb)</MenuItem>
                      <MenuItem value="Ounce (oz)">Ounce (oz)</MenuItem>
                      <MenuItem value="Gallon (gal)">Gallon (gal)</MenuItem>
                      <MenuItem value="Quart (qt)">Quart (qt)</MenuItem>
                      <MenuItem value="Pint (pt)">Pint (pt)</MenuItem>
                      <MenuItem value="Cup (c)">Cup (c)</MenuItem>
                      <MenuItem value="Fluid ounce (fl oz)">
                        Fluid ounce (fl oz)
                      </MenuItem>
                      <MenuItem value="Tablespoon (tbsp)">
                        Tablespoon (tbsp)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack
                  width="100%"
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setItemName("");
                      setItemQuantity("");
                      setItemUnit("");

                      handleEditClose();
                    }}
                    sx={{
                      borderColor: "#000747",
                      "&:hover": {
                        borderColor: "#9196C0",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      editItem(oldItemName, itemName, itemQuantity, itemUnit);

                      setItemName("");
                      setItemQuantity("");
                      setItemUnit("");

                      handleEditClose();
                      handleEditAlertOpen();
                    }}
                    sx={{
                      backgroundColor: "#000747",
                      "&:hover": {
                        backgroundColor: "#9196C0",
                      },
                    }}
                  >
                    Confirm
                  </Button>
                </Stack>
              </Box>
            </Modal>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={editAlertOpen}
              autoHideDuration={3000}
              onClose={handleEditAlertClose}
            >
              <Alert
                onClose={handleEditAlertClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                Item changed successfully!
              </Alert>
            </Snackbar>
            <Button
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
              sx={{
                backgroundColor: "#000747",
                "&:hover": {
                  backgroundColor: "#9196C0",
                },
                marginTop: "-20px",
              }}
            >
              + Add New Item
            </Button>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                width: 400,
                backgroundColor: "#F3F4FC",
              }}
            >
              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                }}
                placeholder="Search products by name..."
                inputProps={{
                  "aria-label": "search items",
                }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IconButton type="button" aria-label="search" sx={{ p: "10px" }}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          <Divider />
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            padding={5}
            sx={{
              marginTop: "-35px",
              marginBottom: "-35px",
            }}
          >
            <Typography
              variant="h6"
              textAlign="left"
              sx={{ flex: 1, color: "#7C7D83" }}
            >
              Product name
            </Typography>
            <Typography
              variant="h6"
              textAlign="left"
              sx={{ flex: 1, color: "#7C7D83" }}
            >
              Quantity
            </Typography>
            <Typography
              variant="h6"
              textAlign="left"
              sx={{ flex: 1, color: "#7C7D83" }}
            >
              Unit(s)
            </Typography>
            <Typography
              variant="h6"
              textAlign="left"
              sx={{ flex: 1, color: "#7C7D83" }}
            >
              Action
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              flexGrow: 1
            }}
            style={{
              overflowY: "auto"
            }}
          >
            <Stack maxHeight="100vh" style={{ overflowX: "hidden", overflowY: "auto" }}>
              {filteredInventory.map(({ name, quantity, unit }, index) => (
                <React.Fragment key={name}>
                  <Box
                    width="100%"
                    minHeight="100px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding={5}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F3F4FC",
                      },
                    }}
                  >
                    <Typography variant="h6" textAlign="left" sx={{ flex: 1 }}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h6" textAlign="left" sx={{ flex: 1 }}>
                      {quantity}
                    </Typography>
                    <Typography variant="h6" textAlign="left" sx={{ flex: 1 }}>
                      {unit}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          addItem(name, "", "");
                        }}
                        sx={{
                          backgroundColor: "#000747",
                          "&:hover": {
                            backgroundColor: "#9196C0",
                          },
                        }}
                      >
                        +
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          removeItem(name);
                        }}
                        sx={{
                          backgroundColor: "#000747",
                          "&:hover": {
                            backgroundColor: "#9196C0",
                          },
                        }}
                      >
                        -
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => {
                          handleEditOpen();

                          setOldItemName(name);

                          setItemName(name);
                          setItemQuantity(quantity);
                          setItemUnit(unit);
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#E8E9F2",
                            "& .MuiSvgIcon-root": {
                              color: "#9196C0",
                            },
                          },
                        }}
                      >
                        <EditIcon sx={{ color: "#000747" }} />
                      </Button>
                      <Button
                        variant="text"
                        sx={{
                          "&:hover": {
                            backgroundColor: "#E8E9F2",
                            "& .MuiSvgIcon-root": {
                              color: "#FF8181",
                            },
                          },
                        }}
                        onClick={() => {
                          deleteItem(name);
                        }}
                      >
                        <DeleteIcon sx={{ color: "#FF0000" }} />
                      </Button>
                    </Stack>
                  </Box>
                  {index < inventory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
