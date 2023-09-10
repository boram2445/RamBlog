# 💙 RamBlog | 모든 개발자들을 위한 블로그




```
🧡 RamBlog는 모든 개발자들을 위한 간편 블로그 프로젝트입니다. 

⭐️ 매일 공부 일지를 블로그에 담아 블로그를 일기장 처럼 사용할 수 있습니다. 

✨ 오래 기억하고 싶은 공부 내용을 블로그에 포스팅하고 공유할 수 있습니다. 

🎀 블로그에 포토폴리오 기능을 담아, 다른 사용자들이 해당 사용자의 기술, 프로젝트를 구경할 수 있습니다. 
```

- 배포 URL : [ram-blog.vercel.app](https://ram-blog.vercel.app/)

<br/>

<div align="center">
<h1>🤔개발 배경</h1>
</div>

- `게으른 완벽주의자`인 저는 블로그에는 완벽한 내용을 담은 글을 올려야 한다는 생각에 블로그에 글을 올리는 것을 항상 주저하였습니다. 
- 하지만, 어딘가에는 `내가 공부한 것을 자랑`하고 싶었고, 또 `오늘 하루 얼마나 열심히 살았는지 기록`하고 싶었습니다.
- 또 많은 분들이 직접 개발한 블로그에는 `자신의 포토폴리오`를 함께 올리는데, velog나 tistory 같은 블로그에는 해당 탭이 없다는 점이 아쉬웠습니다.
- 그렇게 해서 저만의 블로그를 만들어보자! 해서 시작했다가, `저와 생각이 비슷한 다른 개발자`들 또한 사용할 수 있게 만들게 된 프로젝트가 **`RamBlog`** 입니다. 🤩

`매번 백엔드 분들께 api를 받아 처리하다가, 이번 프로젝트에서는 직접 Next.js의 내장 api handler와 Sanity를 이용해서 데이터를 구조화하고 처리하고 있습니다. 한단계 나아갈때 마다 매번 챌린징이기에 머리가 지끈거리지만, 차근차근 기능을 하나씩 붙여나가고 있습니다🔥`

<br/>

<div align="center">
<h1>개발 환경</h1>
</div>

### [기술]

- **Deployment:** : `Vercel`
- **FrontEnd** : `Next.js 13`, `Typescript`, `TailwindCSS`, `SWR`
- **BackEnd** : `Sanity`
- **Authentication** : `Next-auth`

<div align="center">
<h1>주요 기능</h1>
</div>

`강조하고 싶은 기능은 ✨을 붙였습니다`

- 🔐 인증 / 사용자
    1. [로그인 / 로그아웃✨](#login)
    2. [프로필 / 프로필 설정](#profile) 
    3. [팔로워 / 팔로잉](#follow)

- 💙 포스팅
  1. [포스팅✨](#posting)
  2. [포스트 보기 / 태그 기능✨](#posts)
  3. [포스트 상세](#postDetail)
  4. [댓글 쓰기 및 댓글 삭제✨](#comment) 
  5. [포스트 삭제 및 수정](#postEdit)
  6. [전체 포스트](#home)
  

- 📚 로그 (기능 추가중)

  1. [일기 쓰기](#log)


- 😎 프로필 (기능 추가중)
  1. [프로필](#profile)

<br/>

## <span id="login">👍 1. 로그인 / 로그아웃</span>
- **`Next-auth`** 를 이용하여 사용자가 한번의 클릭만으로 간편하게 **`구글 계정`** 으로 **`로그인`** 할 수 있도록 하였습니다.
- 구글에서 제공한 이메일, 이름, 이미지를 통해 사용자를 식별하도록 하였습니다.
- 자동 설정된 위의 데이터는 프로필 수정 탭에서 재설정 가능합니다.

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/12954bf2-260c-4adb-9691-e24afde6524e"  width="600px">
</kbd>

<br/>
<br/>

- 로그인 후 사용자 id를 클릭하면 dropdown nav가 등장하고, **`로그아웃`** 을 할 수 있습니다.

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/7c89cf32-a12a-439e-b5c9-290cc11ced1b" width="600px">
</kbd>

<br/>
<br/>

## <span id="profile">👍 2. 프로필 / 프로필 설정</span>
- 사용자 프로필 클릭시 프로필을 볼 수 있습니다.

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/bf69d261-4c29-4fcd-9246-4ae7512bebf0"  width="600px">
</kbd>

<br/>
<br/>

- **`프로필 설정 탭`** 에서 기본 정보를 변경 가능합니다.
- 블로그 타이틀, 소개, 닉네임, 이미지를 변경할 수 있습니다.
- **`소셜정보를 추가`** 할 수 있으며, 추가시 프로필에 icon으로 보여지게 됩니다. 

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/2019fb35-4dca-4c45-804c-c1e0635ff53e"  width="600px">
</kbd>

<br/>
<br/>

## <span id="follow">👍 3. 팔로잉 / 팔로워 </span>
- 로그인 완료된 사용자는 **`다른 사용자를 팔로잉`** 할 수 있습니다.
- 팔로우 버튼 클릭시, 다른 사용자의 팔로워에 추가되고, 나의 팔로잉에 해당 사용자가 추가됩니다.
- 프로필의 팔로잉, 팔로우 버튼을 클릭해서 현재 팔로잉, 팔로우 중인 사용자를 확인할 수 있습니다. 

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/caec60db-0c45-4ca5-b17f-3a11f1e7ff5d"  width="600px">
</kbd>
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/23483797-9cf3-44ac-8899-4a8939258be5"  width="600px">
</kbd>
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/5b78d2a6-26b9-49d8-9ede-028716f42791"  width="600px">
</kbd>

<br/>
<br/>


## <span id="posting">👍 4. 포스팅✨ </span>
- **`TOAST UI Editor`** 를 사용하여 **`wysiwyg`** 방식으로 글을 작성할 수 있도록 하였습니다.
- 제목, 설명, 태그, 내용을 작성할 수 있습니다.
- 태그는 태그를 입력후 엔터를 치면 **`태그가 추가`** 되며, 추가된 태그를 클릭하면 **`태그 삭제`** 가 가능합니다.
- 이미지 업로드시 **`sanity에 이미지 저장`** 후 해당 url을 받아오도록 하였습니다.
- 이미지를 여러개 업로드시, content 내용을 parsing하여 첫번째 이미지를 포스트의 **`대표 이미지`** 로 지정하도록 하였습니다. 
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/af91531d-2626-4fd4-a7f6-0b333191f8d5"  width="600px">
</kbd>

<br/>
<br/>

## <span id="posts">👍 5. 포스트 보기 / 태그 기능✨ </span>
- 사용자 페이지의 Posts 탭에서 사용자가 올린 전체 포스트를 볼 수 있습니다.
- 태그는 태그에 연결된 포스트가 몇개인지 판별하여 태그와 포스트 개수를 나타냈습니다. 
- **`특정 태그를 클릭`** 하면, 해당 태그에 연결된 포스트를 볼 수 있습니다. 
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/e645578f-4e47-4136-9785-28bca67ff0f7"  width="600px">
</kbd>
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/60da925c-dc2c-41c6-8f54-3c2e383f4e57"  width="600px">
</kbd>

## <span id="postDetail">👍 7. 포스트 상세</span>
- 특정 포스트 클릭시 포스트의 상세 페이지를 볼 수 있습니다.
- 해당 페이지는 SEO 최적화를 고려하여 **`SSR`** 로 페이지를 구성하였습니다. 
- 포스트 주인일 경우, **`수정, 삭제`** 버튼을 볼 수 있습니다.
- 다음 포스트, 이전 포스트가 있을 경우 하단에 **`포스트 이동 버튼`** 이 나타납니다.
  
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/81d1cf5f-cd65-4924-a5c1-9ab0343a355a"  width="600px">
</kbd>

<br/>
<br/>

## <span id="comment">👍 8. 댓글 쓰기 및 댓글 삭제 </span>
- **`로그인 한 이용자`** 의 경우, 바로 댓글 쓰기가 가능합니다.
- 댓글은 **`대댓글 쓰기`** 가 가능합니다.
- 댓글에 대댓글이 달렸을 경우를 감안하여, 댓글 삭제시 실제로 데이터를 삭제하지 않고 **`'삭제된 댓글입니다' 로 텍스트를 변경`**  하도록 하였습니다.
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/8918e96c-a2d4-4014-8e60-73381c67f78d" width="600px">
</kbd>

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/183d5ac6-020a-4ae2-a69d-1143cd3d54f3" width="600px">
</kbd>

<br/>
<br/>

- **`로그인을 하지 않은 이용자`** 의 경우, 아이디와 비밀번호를 설정 후 댓글 입력이 가능합니다.
- 비밀번호는 **`암호화`** 를 하여 sanity에 저장하도록 하였습니다.
- 비밀번호로 잠긴 댓글의 경우, **`삭제시 등록했던 비밀번호를 입력`** 하게 하였고, 저장된 비밀번호와 일치할 경우 삭제가 되도록 하였습니다.

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/4d55ac57-bd57-4c01-a18f-6da7de54e760" width="600px">
</kbd>
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/6a4c73cc-794e-4c54-a2ff-32fe0bd15b78" width="600px">
</kbd>
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/0357872b-5b2c-4d43-a434-855a196a7114" width="600px">
</kbd>

<br/>
<br/>

## <span id="postEdit">👍 9. 포스트 삭제 및 수정 </span>
- 포스트 상세 페이지에서, 자신이 쓴 포스트일 경우 수정과 삭제가 가능합니다.
- 수정 버튼을 클릭시 **`이전에 작성한 내용을 모두 확인`** 할 수 있으며 수정이 가능합니다.

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/1fa3e190-d4d9-4773-ad2c-f88529e17b25" width="600px">
</kbd>

<br/>
<br/>

- 아래와 같이 정상적으로 수정이 된 것을 확인 가능합니다.  

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/ba87c2e1-37b9-406c-bd15-eedca7ff927f" width="600px">
</kbd>

<br/>
<br/>

- 삭제 버튼 클릭시 포스트가 삭제됩니다.
- 해당 포스트에 연결된 **`태그도 함께 제거`** 됩니다.
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/031789f8-1da3-46ec-adac-35fc45239a45" width="600px">
</kbd>

<br/>
<br/>


## <span id="home">👍 10. 전체 포스트 </span>
- home 화면에서는 모든 사용자의 포스트를 구경할 수 있습니다.
- `🖐추천 포스트 기능을 구현중입니다.`

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/d93db146-fcd8-478d-8276-531813a1ff40" width="600px">
</kbd>

<br/>
<br/>

## <span id="log">👍 11. 일기쓰기 </span>

- Log 탭에서는 **`일기 쓰기 버튼`** 을 클릭하여 오늘 공부 했던 내용, 기분, 일상을 짧게 일기처럼 기록할 수 있습니다. 
- 제목, 기록, 이미지를 선택 하여 기록할 수 있습니다.
- `🖐수정, 삭제 기능, 하루 기분 이모지를 추가 가능하도록 구현중입니다.`

<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/ac116f10-6cd8-49c5-849f-0e20f3578070" width="600px">
</kbd>
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/c0578e3d-9810-4f23-83e2-21f4ed2cb034" width="600px">
</kbd>

## <span id="profile">👍 12. 포토폴리오 </span>
- About 탭에서는 사용자의 포토폴리오를 기록할 수 있습니다.
- `🖐사용자별로 변경 가능하도록 구현중입니다.`
<kbd>
  <img src="https://github.com/boram2445/RamBlog/assets/68495264/405eb4c8-dd7b-49a8-b6e5-40dcad16a052" width="600px">
</kbd>


