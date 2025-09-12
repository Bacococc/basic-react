import { useState } from 'react'
import type { Post } from './types/Post'
import { BASE_API_URL } from './apis/baseUrl'
import './App.css'

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
  const handleFindAll = async () => {
    setLoading(true);
    setMessage('로딩 중...');

    try {
      const response = await fetch(BASE_API_URL);
      const result = await response.json();
      if(!response.ok) throw new Error(result.message || '불러오기에 실패했습니다.');

      setPosts(result.data);
      setMessage(result.message);
    } catch (error: any) {
      setMessage(`오류 발생: ${error.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div>
      <h1>API 테스트</h1>
      <strong>{message}</strong>
    </div>

    {/*GET 테스트*/}
      <div>
        <h2>모든 글 검색하기</h2>
        { posts.length < 0 ? (
          <strong>표시할 게시물이 없습니다.</strong>
        ) : ( 
        <ul>
          {posts.map((p) => ( 
            <li key={p.id}>{p.title}
              <p>{p.content}</p>
            </li>
          ))}
        </ul>
        )}
        <button onClick={handleFindAll} disabled={loading}>검색</button>
      </div>
    </>
  )
}


export default App
