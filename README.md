# StaticPage to AWS S3
20263618


### 1단계: AWS S3 버킷 설정

 **S3 버킷을 생성하고 정적 웹사이트로 공개합니다.**

1. **버킷 생성:** 이름 `mybucket-20263618`, 리전 `ap-northeast-2 (서울)`
2. **속성 → 정적 웹 사이트 호스팅:** 활성화, 인덱스 문서 `index.html`
3. **권한 → 퍼블릭 액세스 차단:** 모두 해제 (체크 4개 전부 해제)
4. **권한 → 버킷 정책:** 아래 정책 붙여넣기

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::mybucket-20263618/*"
        }
    ]
}
```

---


### 2단계: 배포용 IAM 사용자 만들기 (최소 권한)

GitHub Actions가 S3에 업로드할 수 있도록 **전용 IAM 사용자**와 **액세스 키**를 만듭니다. 루트 계정 키는 절대 사용하지 마세요.

#### 2-1. IAM 정책 생성

AWS 콘솔 → **IAM → 정책 → 정책 생성 → JSON** 탭에 아래 붙여넣고 이름은 `S3DeployPolicy-mybucket-20263618`로 저장.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::mybucket-20263618"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::mybucket-20263618/*"
        }
    ]
}
```

#### 2-2. IAM 사용자 생성

1. **IAM → 사용자 → 사용자 생성**
2. 이름: `github-actions-deployer`
3. **콘솔 액세스는 체크하지 않음** (프로그래밍 전용)
4. 권한 설정 → **직접 정책 연결** → 위에서 만든 `S3DeployPolicy-mybucket-20263618` 선택
5. 사용자 생성 완료

#### 2-3. 액세스 키 발급

1. 생성한 사용자 클릭 → **보안 자격 증명** 탭 → **액세스 키 만들기**
2. 사용 사례: **다른 AWS 외부에서 실행되는 애플리케이션** 선택
3. 액세스 키와 비밀 액세스 키 표시되는 화면에서 **둘 다 복사** (비밀 키는 이 화면을 닫으면 다시 못 봄)

---


### 3단계: GitHub Secrets 등록

GitHub 저장소 **Settings → Secrets and variables → Actions → New repository secret** 에 2개 등록:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`

> 일반 계정은 세션 토큰이 필요 없습니다. 발급한 액세스 키는 만료되지 않으므로 한 번만 등록하면 됩니다.

---


### 4단계: GitHub Actions 워크플로우

`.github/workflows/deploy.yml` 파일이 이미 아래와 같이 구성되어 있습니다.

```yaml
name: Deploy to AWS S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout source code
      uses: actions/checkout@v4

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2

    - name: Deploy to S3
      run: |
        aws s3 sync ./ s3://mybucket-20263618 --delete --exclude ".git/*" --exclude ".github/*" --exclude "README.md"
```

---


### 5단계: 배포 및 확인

1. 코드를 GitHub `main` 브랜치에 `push`.
2. **Actions** 탭에서 워크플로우가 성공했는지 확인.
3. S3 콘솔 → 버킷 → **속성 → 정적 웹 사이트 호스팅** 하단의 **버킷 웹 사이트 엔드포인트** 주소로 접속.
   * 예: `http://mybucket-20263618.s3-website.ap-northeast-2.amazonaws.com`
