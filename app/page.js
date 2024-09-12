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
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import SearchIcon from "@mui/icons-material/Search";
import BlenderIcon from "@mui/icons-material/Blender";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
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

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
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
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          {["Inventory", "Management", "Recipes"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ marginTop: 1, marginBottom: 1 }}
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
                    <InventoryIcon sx={{ color: "white" }} />
                  ) : index === 1 ? (
                    <AppSettingsAltIcon sx={{ color: "white" }} />
                  ) : (
                    <BlenderIcon sx={{ color: "white" }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ color: "white" }} />
              </ListItemButton>
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
            maxWidth: "1065px",
            height: "660px",
            margin: "auto",
            marginTop: "-75px",
            marginBottom: "-10px",
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
            <Modal open={open} onClose={handleClose}>
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
                <Typography variant="h6">Add item</Typography>
                <Stack width="100%" direction="row" spacing={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value);
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(itemName);
                      setItemName("");

                      handleClose();
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
              Action
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Stack width="1017px" height="470px" overflow="auto">
              {filteredInventory.map(({ name, quantity }, index) => (
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
                      }
                    }}
                  >
                    <Typography variant="h6" textAlign="left" sx={{ flex: 1 }}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h6" textAlign="left" sx={{ flex: 1 }}>
                      {quantity}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          addItem(name);
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
