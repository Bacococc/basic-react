import { useState } from 'react'
import type { Post } from './types/Post'
import { BASE_API_URL } from './apis/baseUrl'
import './App.css'

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [findId, setFindId] = useState<string>();
  
  const handleFindAll = async () => {
    setLoading(true);
    setMessage('로딩 중...');

    try {
      const response = await fetch(BASE_API_URL);
      const result = await response.json();
      if(!response.ok) throw new Error(result.message || '불러오기에 실패했습니다.');

      // setPosts(result.data); 
      setPosts(result); //json-server로 연습하는 중이라 이렇게 처리
      setMessage(result.message); //message는 일단 두기...
    } catch (error: any) {
      setMessage(`오류 발생: ${error.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFindById = async (e: React.FormEvent) => {
    if(!findId) {
      setMessage('검색할 ID를 입력 해주세요.')
      return;
    }

    setLoading(true);
    setMessage('로딩 중...');
    try {
      const response = await fetch (`${BASE_API_URL}/${findId}`);
      const result = await response.json();
      if(!response.ok) throw new Error(result.message || '검색에 실패했습니다.');
      
      setPosts([result]);
      setMessage(result.message);
    } catch (error: any) {
      setMessage(error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    };


  }


  return (
    <>
    <div>
      <h1>API 테스트</h1>
      <strong>{message}</strong>
    </div>

    {/*GET 테스트*/}
      <div>
        <h2>모든 글 검색하기</h2>
        { posts.length === 0 ? (
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

      {/*GET id 검색 테스트*/}
      <div>
        <h2>ID로 글 검색하기</h2>
        <form onSubmit={handleFindById}>
          <input type='text' value={findId} onChange={(e) => setFindId(e.target.value)} placeholder='ID를 입력...'></input>
          <button type='submit' disabled={loading}>검색</button>
        </form>
      </div>
    </>
  )
}


export default App
