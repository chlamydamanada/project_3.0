export type commentViewType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
  }
};
