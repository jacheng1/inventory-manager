"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Typography,
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
  Snackbar,
  Alert,
} from "@mui/material";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import BlenderIcon from "@mui/icons-material/Blender";
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { Clock, Users } from "lucide-react";

export default function Recipes() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasGeneratedRecipe, setHasGeneratedRecipe] = useState(false);

  const drawerWidth = 230;

  const handleSelectedIndex = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    fetchInventoryDocuments();
  }, []);

  const generateRecipe = async () => {
    try {
      const ingredients = ["Tomato", "Cheese", "Pasta"];

      const response = await fetch("/api/generateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();

      console.log(data.recipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };

  const fetchInventoryDocuments = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);

    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push(
        doc.data().name
      );
    });

    setInventory(inventoryList);
    setLoading(false);
  };

  const generate = async () => {
    setLoading(true);

    await fetchRecipe(inventory);

    setHasGeneratedRecipe(true);
  }

  const fetchRecipe = async (ingredients) => {
    try {
      const suggestion = await generateRecipe(ingredients);

      const parser = new DOMParser();
      const doc = parser.parseFromString(suggestion, "text/html");

      const recipeData = {
        title: doc.querySelector('.recipe-title')?.textContent || '',
        difficulty: doc.querySelector('.recipe-difficulty')?.textContent || '',
        prepTime: doc.querySelector('.recipe-time:nth-of-type(1)')?.textContent || '',
        cookTime: doc.querySelector('.recipe-time:nth-of-type(2)')?.textContent || '',
        servings: doc.querySelector('.recipe-servings')?.textContent || '',
        ingredients: Array.from(doc.querySelectorAll('.recipe-ingredients li')).map(li => li.textContent),
        instructions: Array.from(doc.querySelectorAll('.recipe-instructions li')).map(li => li.textContent),
        notes: doc.querySelector('.recipe-notes p')?.textContent || '',
      };

      setRecipe(recipeData);
    } catch (error) {
      console.error("Error; cannot fetch recipe:", error);

      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

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
              Recipes
            </Typography>
              {!hasGeneratedRecipe && (
                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={() => {
                    generate();
                  }}
                  sx={{
                    backgroundColor: "#000747",
                    "&:hover": {
                      backgroundColor: "#9196C0",
                    },
                    marginTop: "-20px",
                  }}
                >
                  {loading ? "Generating..." : "Generate Recipe"}
                </Button>
              )}
              {loading ? (
                <Typography variant="h6">Loading recipe suggestion...</Typography>
              ) : recipe ? (
                <Box>
                  <Typography variant="h6">{recipe.name}</Typography>
                  <Box>
                    <Typography variant="h6" textAlign="left">
                      {recipe.difficulty}
                    </Typography>
                    <Typography variant="h6" textAlign="left">
                      <Clock />
                      {recipe.prepTime}
                    </Typography>
                    <Typography variant="h6" textAlign="left">
                      <Clock />
                      {recipe.cookTime}
                    </Typography>
                    <Typography variant="h6" textAlign="left">
                      <Users />
                      {recipe.servings}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="h6">Ingredients</Typography>
                    <List>
                      {recipe.ingredients.map((ingredient, index) => {
                        <ListItemText key={index}>{ingredient}</ListItemText>
                      })}
                    </List>
                  </Box>
                  <Box>
                    <Typography variant="h6">Instructions</Typography>
                    <List>
                      {recipe.instructions.map((instruction, index) => {
                        <ListItemText key={index}>{instruction}</ListItemText>
                      })}
                    </List>
                  </Box>
                  {recipe.notes && (
                    <Box>
                      <Divider />
                      <Typography variant="h6">Chef notes</Typography>
                      <Typography variant="h6">{recipe.notes}</Typography>
                    </Box>
                  )}
                </Box>
              ) : hasGeneratedRecipe ? (
                <Typography variant="h6">Failed to generate recipe</Typography>
              ) : (
                <Typography variant="h6">Click the button above to generate a recipe suggestion.</Typography>
              )}
          </Box>
          <Divider />
        </Box>
      </Box>
    </Box>
  );
};
