import React, { useState, useEffect } from "react";
import "./Post.css";
import CommentIcon from "../../img/comment.png";
import Share from "../../img/share.png";
import HeartIcon from "../../img/like.png";
import NotLikeIcon from "../../img/notlike.png";
import { likePost, postComment, getUser } from "../../api/PostsRequests";
import { useSelector } from "react-redux";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(data.comments || []);

  useEffect(() => {
    fetchUsernamesForComments(comments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsernamesForComments = async (commentsToFetch) => {
    try {
      const newCommentsWithUsernames = await Promise.all(
        commentsToFetch.map(async (comment) => {
          if (!comment.username) {
            const response = await getUser(comment.userId);
            return { ...comment, username: response.data.username };
          }
          return comment;
        })
      );
      setComments(newCommentsWithUsernames);
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked(!liked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
  };

  const handleCommentIconClick = () => {
    setShowCommentInput((prev) => !prev);
  };

  const handleCommentSubmit = async () => {
    try {
      await postComment(data._id, user._id, comment);
      setComment("");
      const newComment = {
        userId: user._id,
        text: comment,
      };
      setComments([...comments, newComment]);
      fetchUsernamesForComments([newComment]);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="Post">
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt=""
      />
      <div className="postReact">
        <img
          src={liked ? HeartIcon : NotLikeIcon}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img
          src={CommentIcon}
          alt="Comment"
          onClick={handleCommentIconClick}
          style={{ cursor: "pointer" }}
        />
        {showCommentInput && (
          <div>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
          </div>
        )}
        <img src={Share} alt="" />
      </div>
      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      <div className="detail">
        <span>
          <b>{data.name} </b>
        </span>
        <span>{data.desc}</span>
      </div>
      <div>
        {comments.map((comment, index) => (
          <div key={index}>
            <b>{comment.username}</b> - {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
