import * as PostsApi from "../api/PostsRequests";
export const POST_COMMENT_START = "POST_COMMENT_START";
export const POST_COMMENT_SUCCESS = "POST_COMMENT_SUCCESS";
export const POST_COMMENT_FAIL = "POST_COMMENT_FAIL";

export const getTimelinePosts = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const { data } = await PostsApi.getTimelinePosts(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};

export const postComment = (postId, userId, text) => async (dispatch) => {
  dispatch({ type: POST_COMMENT_START });
  try {
    const newComment = await PostsApi.postComment(postId, userId, text);
    dispatch({ type: POST_COMMENT_SUCCESS, newComment });
  } catch (error) {
    console.error(error);
    dispatch({ type: POST_COMMENT_FAIL });
  }
};
