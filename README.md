# 온라인 서점 API

- [온라인 서점 API](#온라인-서점-api)
  - [기능 극복 사례 (링크)](#기능-극복-사례-링크)
  - [도메인 설계](#도메인-설계)
    - [도서 도메인 ERD](#도서-도메인-erd)
    - [주문 도메인 ERD](#주문-도메인-erd)
    - [프로모션 도메인 ERD](#프로모션-도메인-erd)
    - [회원 도메인 ERD](#회원-도메인-erd)
  - [시스템 설계도](#시스템-설계도)
  - [API 명세 (링크)](#api-명세-링크)
  - [실행 방법 (링크)](#실행-방법-링크)

<br/>

## [기능 극복 사례 (링크)](https://github.com/kimdev0206/project-2/wiki/%EA%B8%B0%EB%8A%A5-%EA%B7%B9%EB%B3%B5-%EC%82%AC%EB%A1%80)

링크를 확인해주세요. wiki 로 이동합니다.

## 도메인 설계

- 테이블을 리소스 식별에 적합한 도메인으로 분류하였습니다. 공개된 테이블은 해당 도메인에 분류된 항목을 의미합니다.

- 복합키는 중복도가 낮을 순서로 설정하였습니다.

### 도서 도메인 ERD

```mermaid
erDiagram
   likes {
      int user_id PK, FK
      int book_id PK, FK
   }

   cart_books {
      int user_id PK, FK
      int book_id PK, FK
      int count
   }

   books {
      int id PK
      varchar(45) title
      int category_id
      varchar(45) form
      char(13) isbn
      varchar(1024) summary
      varchar(2048) detail
      varchar(45) author
      int pages
      text contents
      int price
      int amount
      int likes
      date published_at
      timestamp created_at
   }

   users ||--o{ likes : ""
   books ||--o{ likes : ""
   books ||--o{ cart_books : ""
   users ||--o{ cart_books : ""
```

### 주문 도메인 ERD

```mermaid
erDiagram
   orders {
      char(36) order_id PK
      int user_id FK
      json delivery
      json books
      varchar(45) main_book_title
      int total_price
      int total_count
      timestamp created_at
   }

   books ||--o{ cart_books : ""
   users ||--o{ cart_books : ""
   users ||--o{ orders : ""
```

### 프로모션 도메인 ERD

```mermaid
erDiagram
   promotions {
      int id PK
      varchar(45) title
      decimal discount_rate
      date start_at
      date end_at
   }

   promotion_users {
      int user_id PK, FK
      int promotion_id PK, FK
   }

   promotion_categories {
      int book_id PK, FK
      int category_id PK
      int promotion_id PK, FK
   }

   books || --|{ promotion_categories : ""
   users || --o{ promotion_users : ""
   promotions || --o{ promotion_categories : ""
   promotions || --o{ promotion_users : ""
```

### 회원 도메인 ERD

```mermaid
erDiagram
   users {
      int id PK
      varchar(100) email
      char(24) hashed_password
      char(24) salt
      tinyint(1) is_deleted
      timestamp created_at
   }
```

## 시스템 설계도

![](./assets//image.drawio.png)

<br/>

## [API 명세 (링크)](https://documenter.getpostman.com/view/31843867/2s9Ykt5zMy)

도메인에 따라 API 를 분류하였습니다.

링크를 확인해주세요. postman docs 로 이동합니다.

## [실행 방법 (링크)](https://github.com/kimdev0206/project-2/wiki/%EC%8B%A4%ED%96%89-%EB%B0%A9%EB%B2%95)

링크를 확인해주세요. wiki 로 이동합니다.
