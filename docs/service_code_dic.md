### Service Code 읽는법
    서비스 코드는 3자리 숫자로 이루어져있으며 
    XYZ 라고 할때 다음과 같은 의미를 갖는다.
    
    첫째자리 X = 서비스
    둘째자리 Y = 기능
    셋째자리 Z = 처리결과


    
### 서비스 코드 분류

#### 서비스
    2 : 사용자관리서비스
    3 : 공지사항서비스
    
#### 기능
##### 사용자관리서비스 기능
    0 : 회원가입
    1 : 회원정보수정
    2 : 로그인
    3 : 팔로우
    4 : 언팔로우
    9 : 공통
    
##### 처리결과
    0 : 정상
    1 : 이미 완료됨
    4 : 사용자 정보 없음 
    5 : 인증이 토큰이 만료되었거나 실패 
    6 : 입력 데이터 부족
    7 : 대상 데이터 없음
    8 : 오류
    9 : 잘못된 HTTP 메소드 요청
    