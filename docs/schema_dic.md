## 스키마 , 인덱스

### User 스키마

```javascript 1.7
const sUser = mongoose.Schema({
//  _id         : {type: ObjectId, required: false, unique: true},
    // 필드 고유값, 자동생성
    signhash	: {type: String, required: true, unique: true},
    // 고유키 값
    nickname		: {type: String, required: true},
    email		: {type: String, required: true, unique:true},
    password	: {type: String, required: true},
    
    regDate		: {type: Date, required: true, default: Date.now},
    // 가입일자
    intro		: {type: String, default: ''},
    // 자기소개
    profileReg	: {type: Date},
    // 프로필 등록 일자

    follower	: [sFollow],
    // 팔로워 리스트 배열(Follow 스키마 참고)
    following	: [sFollow]
    // 팔로잉 리스트 배열(Follow 스키마 참고)
});

sUser.index({email:1, signhash:1});
//인덱싱
```


### Follow 스키마

```javascript 1.7
const sFollow = mongoose.Schema({
//  _id         : {type: ObjectId, required: false, unique: true},
    // 필드 고유값, 자동생성
    fid			: {type: ObjectId, required: false, unique: true},
    // 팔로워 필드 고유값( = _id)
    signhash	: {type: String, required: true, unique: true},
    // 팔로워 고유키값
    nickname	: {type: String, required: true},
    profileReg	: {type: Date, required: false},
    // 팔로워 프로필 최종변경일자
});

sFollow.index({fid:1, signhash:1});
// 인덱싱
```

---

