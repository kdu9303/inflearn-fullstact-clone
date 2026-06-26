# PostgreSQL Docker 업그레이드 가이드

이 문서는 Docker 기반 PostgreSQL 15 환경을 기존 데이터를 보존한 상태로 PostgreSQL 18로 업그레이드하는 방법을 설명합니다.

## 목표

- 기존 데이터 보존
- PostgreSQL 15의 기존 데이터 볼륨을 PostgreSQL 18에 직접 연결하지 않기
- 안전한 dump/restore 방식 사용

## 권장 방식

PostgreSQL 15에서 논리 백업을 생성한 뒤, PostgreSQL 18을 새 볼륨으로 띄우고 백업을 복원합니다.

이 방식이 Docker 환경에서 가장 안전합니다. PostgreSQL의 메이저 버전이 바뀌면 디스크 저장 형식도 바뀔 수 있기 때문입니다.

## 기존 볼륨을 그대로 쓰면 안 되는 이유

PostgreSQL 15의 데이터 디렉터리를 PostgreSQL 18 컨테이너에 그대로 마운트하면 안 됩니다.

이 방식은 같은 메이저 버전의 마이너 업그레이드에서만 안전합니다. 15에서 18처럼 메이저 버전이 바뀌는 경우에는 아래 방법 중 하나를 써야 합니다.

- `pg_dumpall` 후 복원
- `pg_upgrade`
- logical replication

대부분의 Docker 구성에서는 `pg_dumpall`이 가장 단순하고 안전합니다.

## 권장 절차

### 1. PostgreSQL 15 백업

기존 컨테이너 이름이 `postgres15`라면:

```bash
docker exec -e PGPASSWORD=admin1234 -t postgres15 pg_dumpall -U root > backup.sql
```

이미 환경변수로 비밀번호를 관리하고 있다면 `PGPASSWORD`는 생략할 수 있습니다.

### 2. 기존 컨테이너 중지

```bash
docker compose down
```

롤백 가능성을 남겨두려면 기존 볼륨은 아직 삭제하지 마세요.

### 3. Docker 이미지를 PostgreSQL 18로 변경

`docker-compose.yml`의 이미지 태그를 `postgres:15`에서 `postgres:18`로 바꿉니다.

예시:

```yaml
services:
  db:
    image: postgres:18
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: admin1234
      POSTGRES_DB: inflearn_clone
    volumes:
      - pgdata18:/var/lib/postgresql/data

volumes:
  pgdata18:
```

중요:

- PostgreSQL 18에는 **새 볼륨 이름**을 사용하세요.
- PostgreSQL 15의 데이터 볼륨을 재사용하지 마세요.

### 4. PostgreSQL 18 시작

```bash
docker compose up -d
```

### 5. 백업 복원

```bash
cat backup.sql | docker compose exec -T db psql -U root -d postgres
```

`postgres`가 아니라 특정 데이터베이스로 복원해야 한다면 대상 DB 이름을 바꿔주세요.

### 6. 데이터 확인

데이터베이스 목록 확인:

```bash
docker compose exec db psql -U root -d postgres -c "\\l"
```

애플리케이션 데이터베이스의 테이블 확인:

```bash
docker compose exec db psql -U root -d inflearn_clone -c "\\dt"
```

## 롤백 계획

문제가 생기면 다음 순서로 되돌리면 됩니다.

1. PostgreSQL 18 컨테이너를 중지합니다.
2. 기존 PostgreSQL 15 컨테이너를 다시 올립니다.
3. 15 버전의 기존 볼륨을 다시 연결합니다.
4. 기존 데이터가 그대로 있는지 확인합니다.

새 컨테이너가 기존 볼륨을 건드리지 않기 때문에, 이전 볼륨을 유지했다면 롤백은 비교적 쉽습니다.

## 대안: `pg_upgrade`

`pg_upgrade`는 더 빠르지만 Docker에서는 설정이 더 복잡합니다.

다운타임을 줄여야 하고 다음 요소를 직접 관리할 수 있을 때만 사용하세요.

- 기존/신규 PostgreSQL 바이너리
- 기존/신규 데이터 디렉터리
- 업그레이드 점검과 link/copy 모드

이 레포에서는 dump/restore 방식이 기본적으로 더 안전합니다.

## 이 레포 기준 메모

- 백엔드는 `backend/.env`를 통해 DB에 연결합니다.
- PostgreSQL 포트나 데이터베이스 이름이 바뀌면 `backend/.env`도 같이 수정해야 합니다.
- 복원 후 필요하면 `backend/`에서 Prisma 점검을 실행하세요.

```bash
pnpm prisma validate
pnpm prisma generate
```

## 요약

Docker에서 PostgreSQL 15를 18로 옮길 때 안전한 흐름은 다음과 같습니다.

1. `pg_dumpall` from PostgreSQL 15
2. 새 볼륨으로 PostgreSQL 18 시작
3. 덤프 복원
4. 스키마와 데이터 확인
