import { useState } from 'react'
import type { Post, UpdatePostDto } from './types/Post'
import { BASE_API_URL } from './apis/baseUrl'

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [findId, setFindId] = useState<string>('');
  const [findTitle, setFindTitle] = useState<string>('');
  const [createData, setCreateData] = useState({ title: '', content: '' });
  const [updateData, setUpdateData] = useState({ id: '', title: '', content: '' });
  const [deleteId, setDeleteId] = useState<string>(''); 
  
  const handleFindAll = async () => {
    setLoading(true);
    setMessage('로딩 중...');

    try {
      const response = await fetch(BASE_API_URL);
      const result = await response.json();
      if(!response.ok) throw new Error(result.message || '불러오기에 실패했습니다.');

      // setPosts(result.data); 
      setPosts(result); //json-server로 연습하는 중이라 이렇게 처리
      setMessage(result.message); //message도 json-server 써서 없는 필드이지만 일단 두기...
    } catch (error: any) {
      setMessage(`오류 발생: ${error.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFindById = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setFindId('');
    }
  };

  const handleFindByTitle = async (e: React.FormEvent) => {
    if(!findTitle) {
      e.preventDefault();
      setMessage('검색할 제목을 입력해주세요.');
      return;
    } 

    setLoading(true);
    setMessage('검색 중...');
    try {
      const response = await fetch (`${BASE_API_URL}?title=${encodeURIComponent(findTitle)}`);
      const result = await response.json(); //response의 바디를 json으로 파싱 해줘야 하기 때문에(HTTP response 자체의 body는 json으로 읽지 않은, 스트림 상태) response.message 등 필드 사용이 불가능
      if(!response.ok) throw new Error(result.message || '검색에 실패했습니다.');

      setPosts(result);
      setMessage(result.message);
    } catch (error: any) {
      setMessage(`오류 발생: ${error.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
      setFindTitle('');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    if(!createData.title || !createData.content) {
      setMessage('제목과 내용을 모두 입력해주세요.');
      return;
    } 
    setLoading(true);
    setMessage('로딩 중...');
    try {
      const response = await fetch(BASE_API_URL, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(createData),
      });
      const result = await response.json();
      if(!response.ok) throw new Error (result.message || '검색에 실패했습니다.');
      setMessage(result.message);
      await handleFindAll();
    } catch (error: any) {
      setMessage(`오류 발생: ${error.message}`)
      setCreateData({title: '', content: ''})
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async (e: React.FormEvent) => {
    if(!updateData.id) {
      setMessage('수정할 게시물의 ID를 입력 해주세요.');
      return;
    };
    setLoading(true);
    setMessage('로딩 중...');
    // title 혹은 content 중 하나만 수정 했을 경우, 빈 값이 보내져 원래 내용에 덮어씌워 지는 것을 방지
    const body: UpdatePostDto = { }; //빈 객체 만들기
    if (updateData.title) body.title = updateData.title; //title 필드에 값이 있다면 body에 같은 값 추가
    if (updateData.content) body.content = updateData.content; //content 필트에 입력된 값이 있다면 body에 같은 값 추가
    // 최종적으로 둘 다 수정이 되었을 경우에는 두 필드 모두의 값이 들어감
    try { 
      const response = await fetch (`${BASE_API_URL}/${updateData.id}`, {
        method: `PATCH`,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
      const result = await response.json();
      setMessage(result.message);
      setUpdateData({id: '', title: '', content: ''});
      await handleFindAll();
    } catch(error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    if(!deleteId) {
      setMessage('삭제할 게시물의 ID를 입력 해주세요.');
      return;
    }
    setLoading(true);
    setMessage('로딩 중...');
    try {
      const response = await fetch(`${BASE_API_URL}/${deleteId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if(!response.ok) throw new Error (result.message || '삭제에 실패했습니다.');
      setDeleteId('');
      setMessage(result.message);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div>
      <h1>API 테스트</h1>
      <strong>상태: {message}</strong>
    </div>

    {/*GET 테스트*/}
      <div>
        <h2>모든 글 검색하기</h2>
        { posts.length === 0 ? (
          <strong>표시할 게시물이 없습니다.</strong>
        ) : ( 
        <ul>
          {posts.map((p) => ( 
            <li key={p.id}>{p.title} [ID: {p.id}]
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

      {/*GET 제목 검색 테스트*/}
      <div>
        <h2>제목으로 글 검색하기</h2>
        <form onSubmit={handleFindByTitle}>
          <input type='text' value={findTitle} onChange={(e) => (setFindTitle(e.target.value))} placeholder='제목을 입력...'></input>
          <button type='submit' disabled={loading}>검색</button>
        </form>
      </div>

      {/*POST 글쓰기 테스트*/}
      <div>
        <h2>글 작성하기</h2>
        <form onSubmit={handleCreate}>
          <input type='text' value={createData.title} onChange={(e) => setCreateData({...createData, title: e.target.value})}></input>
          <textarea value={createData.content} onChange={(e) => setCreateData({...createData, content: e.target.value})}></textarea>
          <button type='submit' disabled={loading}>글 작성</button>
        </form>
      </div>

      {/*PATCH 글 수정 테스트*/}
      <div>
        <h2>글 수정하기</h2>
        <form onSubmit={handleEditPost}>
          <input type='text' value={updateData.id} onChange={(e) => setUpdateData({...updateData, id: e.target.value})} placeholder='ID'></input>
          <input type='text' value={updateData.title} onChange={(e) => setUpdateData({...updateData, title: e.target.value})} placeholder='제목'></input>
          <textarea value={updateData.content} onChange={(e) => setUpdateData({...updateData, content: e.target.value})} placeholder='내용'></textarea>
          <button type='submit' disabled={loading}>글 수정</button>
        </form>
      </div>

      {/*DELETE 글 삭제 테스트*/}
      <div>
        <h2>글 삭제하기</h2>
        <form onSubmit={handleDelete}>
          <input type='text' value={deleteId} onChange={(e) => setDeleteId(e.target.value)} placeholder='삭제할 ID'></input>
          <button type='submit' disabled={loading}>글 삭제</button>
        </form>
      </div>

    </>
  )
};


export default App
