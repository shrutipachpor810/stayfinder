import React, { useEffect, useState } from "react";
import API from "../api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Container,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";



const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("userName") || "Anonymous";

  const fetchPosts = async () => {
    try {
      const res = await API.get(`/community`);
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      await API.post(`/community`, {
        userId,
        name,
        content: newPost,
      });
      setNewPost("");
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Post failed! Check console or network tab for details.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        py: 6,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              color: "#e91e63",
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ForumIcon fontSize="large" />
            Community Board
          </Typography>
          <Typography color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Share your travel experiences, stories, or tips with the community
          </Typography>
        </Box>

        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 5,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <TextField
            multiline
            fullWidth
            rows={3}
            label="Share your thoughts..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            variant="outlined"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <Button
            onClick={handlePostSubmit}
            variant="contained"
            size="large"
            startIcon={<RocketLaunchIcon />}
            sx={{
              mt: 2,
              textTransform: "none",
              borderRadius: 3,
              backgroundColor: "#e91e63",
              color: "#fff",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              "&:hover": {
                backgroundColor: "#d81b60",
              },
            }}
            disabled={!newPost.trim()}
          >
            Post
          </Button>
        </Paper>

        {posts.length === 0 ? (
          <Typography
            align="center"
            color="text.secondary"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            No community posts yet. Be the first to share!
          </Typography>
        ) : (
          posts.map((post) => (
            <Paper
              key={post._id}
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "#ffffff",
                border: "1px solid #f0f0f0",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                  color: "#111",
                }}
              >
                {post.content}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: "'Poppins', sans-serif" }}
              >
                <PersonIcon fontSize="small" />
                <strong>{post.name || "Anonymous"}</strong> •{" "}
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))
        )}
      </Container>
    </Box>
  );
};

export default CommunityPage;
