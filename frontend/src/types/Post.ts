export interface Post {
  id: string, //json-server 사용 중이므로 string으로 바꿔두기... 백엔드가 없으니 숫자로 변환 하는 과정 X
  title: string,
  content: string
};

export type UpdatePostDto = {
  title?: string;
  content?: string;
};