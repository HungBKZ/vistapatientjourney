export type Cluster = {
  slug: string;
  title: string;
  shortDescription: string;
  keyword: string;
};

export type Article = {
  slug: string;
  clusterSlug: string;
  title: string;
  description: string;
  longTailKeyword: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const clusters: Cluster[] = [
  {
    slug: 'tat-khuc-xa',
    title: 'Tat khuc xa',
    shortDescription:
      'Tong hop kien thuc can thi, vien thi, loan thi va cach theo doi thi luc thuc te.',
    keyword: 'tat khuc xa',
  },
  {
    slug: 'benh-ly-pho-bien',
    title: 'Benh ly pho bien',
    shortDescription:
      'Thong tin co ban ve duc thuy tinh the, thoai hoa diem vang va cac dau hieu can kham som.',
    keyword: 'benh ly mat pho bien',
  },
  {
    slug: 'cham-soc-mat-man-hinh',
    title: 'Cham soc mat do man hinh',
    shortDescription:
      'Huong dan bao ve mat cho hoc sinh, sinh vien, dan van phong su dung man hinh thuong xuyen.',
    keyword: 'cham soc mat khi dung man hinh',
  },
];

export const articles: Article[] = [
  {
    slug: 'dau-hieu-can-thi-o-hoc-sinh',
    clusterSlug: 'tat-khuc-xa',
    title: 'Dau hieu can thi o hoc sinh va cach theo doi tai nha',
    description:
      'Nhan biet som dau hieu can thi o hoc sinh de dua tre di kham dung thoi diem va han che tang do nhanh.',
    longTailKeyword: 'dau hieu can thi o hoc sinh',
    sections: [
      {
        heading: 'Nhung dau hieu phu huynh de bo qua',
        paragraphs: [
          'Tre thuong nheo mat khi nhin bang, ngoi sat tivi hoac cui sat vo de doc bai la bieu hien pho bien.',
          'Neu tre hay than nhuc mat, dau dau sau gio hoc, do co the la dau hieu qua tai thi giac.',
        ],
      },
      {
        heading: 'Khi nao can dua tre di kham khuc xa',
        paragraphs: [
          'Can kham som neu tre co dau hieu giam tap trung hoc tap, doi cho ngoi gan bang de nhin ro.',
          'Tam soat dinh ky 6-12 thang giup phat hien thay doi do can va dieu chinh kinh kip thoi.',
        ],
      },
      {
        heading: 'Cach theo doi tai nha giup han che tang do',
        paragraphs: [
          'Ap dung quy tac 20-20-20, tang thoi gian hoat dong ngoai troi, dam bao anh sang hoc tap phu hop.',
          'Ghi lai cac dau hieu theo tuan de trao doi cu the voi bac si khi tai kham.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Hoc sinh can kiem tra thi luc bao lau mot lan?',
        answer:
          'Thong thuong nen tam soat moi 6-12 thang. Neu da deo kinh hoac co dau hieu bat thuong thi can kham som hon.',
      },
      {
        question: 'Ngoi gan tivi co lam tang do can ngay lap tuc khong?',
        answer:
          'Khong lam tang do ngay lap tuc, nhung day la dau hieu tre dang nhin xa kem va can duoc kiem tra thi luc.',
      },
    ],
  },
  {
    slug: 'phan-biet-loan-thi-va-can-thi',
    clusterSlug: 'tat-khuc-xa',
    title: 'Phan biet loan thi va can thi: trieu chung, cach nhin, huong xu ly',
    description:
      'Huong dan phan biet loan thi va can thi qua trieu chung thuong gap va cach kiem tra dung.',
    longTailKeyword: 'phan biet loan thi va can thi',
    sections: [
      {
        heading: 'Can thi va loan thi khac nhau o diem nao',
        paragraphs: [
          'Can thi thuong mo khi nhin xa, trong khi loan thi co the lam hinh anh meo, nhin doi hoac mo o nhieu khoang cach.',
          'Hai tinh trang co the xuat hien dong thoi, vi vay can do khuc xa chinh xac thay vi tu doan.',
        ],
      },
      {
        heading: 'Dau hieu nhan biet trong sinh hoat hang ngay',
        paragraphs: [
          'Nguoi loan thi de moi mat ve chieu, kho doc chu nho lau, de chay nuoc mat khi lam viec can tap trung cao.',
          'Nguoi can thi thuong nhin gan ro hon nhin xa va phai dua dien thoai gan mat khi xem noi dung.',
        ],
      },
      {
        heading: 'Khi nao nen doi kinh hoac tai kham',
        paragraphs: [
          'Neu thi luc giam, nhuc dau sau khi deo kinh hoac kho lam viec lien tuc, can tai kham de dieu chinh do kinh.',
          'Khong nen tu mua kinh ma khong co ket qua do khuc xa vi de gay met moi va giam hieu qua hoc tap, lam viec.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Loan thi co de bo sung bang kinh duoc khong?',
        answer:
          'Co, kinh co the bo sung do loan thi. Dieu quan trong la do dung truc va do can/loan theo chi dinh chuyen mon.',
      },
      {
        question: 'Can thi co tu het khi truong thanh?',
        answer:
          'Thong thuong can thi khong tu het. Do can co the on dinh theo tuoi nhung van can theo doi dinh ky.',
      },
    ],
  },
  {
    slug: 'trieu-chung-duc-thuy-tinh-the-giai-doan-dau',
    clusterSlug: 'benh-ly-pho-bien',
    title: 'Trieu chung duc thuy tinh the giai doan dau can biet',
    description:
      'Tong hop cac dau hieu som cua duc thuy tinh the va thoi diem nen kham nhan khoa.',
    longTailKeyword: 'trieu chung duc thuy tinh the giai doan dau',
    sections: [
      {
        heading: 'Dau hieu som cua duc thuy tinh the',
        paragraphs: [
          'Nguoi benh co the thay nhin nhu co suong, loe sang khi di dem, kho nhan dien chi tiet nho.',
          'Mau sac co xu huong nhat dan, giam do tuong phan khi doc sach hoac xem dien thoai.',
        ],
      },
      {
        heading: 'Doi tuong co nguy co cao',
        paragraphs: [
          'Nguoi tren 50 tuoi, nguoi co benh nen nhu dai thao duong, nguoi tiep xuc tia UV nhieu co nguy co cao hon.',
          'Tien su hut thuoc, dung corticoid keo dai cung la yeu to can luu y.',
        ],
      },
      {
        heading: 'Khi nao can kham va huong dieu tri',
        paragraphs: [
          'Neu nhin mo anh huong sinh hoat, can kham som de danh gia muc do va lua chon huong xu ly phu hop.',
          'Dieu tri co the bat dau bang theo doi, doi kinh, va khi can se phau thuat thay thuy tinh the.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Duc thuy tinh the co dung thuoc la khoi khong?',
        answer:
          'Thuoc khong the lam thuy tinh the trong lai hoan toan. Giai phap triet de thuong la phau thuat khi du dieu kien.',
      },
      {
        question: 'Moi mat khi doc sach co phai duc thuy tinh the?',
        answer:
          'Khong nhat thiet, vi con co the lien quan toi lao hoa, tat khuc xa hoac kho mat. Can kham de chan doan dung.',
      },
    ],
  },
  {
    slug: 'cach-cham-soc-mat-khi-dung-may-tinh-nhieu',
    clusterSlug: 'cham-soc-mat-man-hinh',
    title: 'Cach cham soc mat khi dung may tinh nhieu moi ngay',
    description:
      'Checklist thuc te giup dan van phong giam moi mat, kho mat va duy tri thi luc on dinh.',
    longTailKeyword: 'cach cham soc mat khi dung may tinh nhieu',
    sections: [
      {
        heading: 'Vi sao mat de met khi nhin man hinh lau',
        paragraphs: [
          'Tan suat chop mat giam khi tap trung vao man hinh, gay kho mat, cay mat va cam giac nong rat.',
          'Tu the ngoi sai va anh sang xanh man hinh co the lam trieu chung ro hon ve cuoi ngay.',
        ],
      },
      {
        heading: 'Checklist 5 buoc bao ve mat trong ngay lam viec',
        paragraphs: [
          'Ap dung quy tac 20-20-20, dieu chinh do sang man hinh, dat man hinh cach mat 50-70 cm.',
          'Bo tri anh sang phong hop ly, giu tu the ngoi thang va bo sung nuoc de han che kho mat.',
        ],
      },
      {
        heading: 'Khi nao can den co so nhan khoa',
        paragraphs: [
          'Neu do moi mat keo dai nhieu tuan, nhin mo tang dan, dau dau thuong xuyen thi can di kham.',
          'Kham dinh ky giup phat hien som tat khuc xa, kho mat man tinh hoac benh ly lien quan.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Kinh chong anh sang xanh co can thiet cho moi nguoi khong?',
        answer:
          'Khong bat buoc voi tat ca moi nguoi. Hieu qua phu thuoc nhu cau lam viec va trieu chung cu the.',
      },
      {
        question: 'Nho nuoc mat nhan tao moi ngay co an toan khong?',
        answer:
          'Co the su dung theo huong dan, uu tien loai phu hop. Neu can dung keo dai, nen duoc tu van chuyen mon.',
      },
    ],
  },
  {
    slug: 'khi-nao-can-di-kham-nhan-khoa-ngay',
    clusterSlug: 'cham-soc-mat-man-hinh',
    title: 'Khi nao can di kham nhan khoa ngay: 8 dau hieu canh bao',
    description:
      'Danh sach dau hieu canh bao can di kham nhan khoa som de tranh bien chung nguy hiem.',
    longTailKeyword: 'khi nao can di kham nhan khoa ngay',
    sections: [
      {
        heading: '8 dau hieu canh bao khong nen tri hoan',
        paragraphs: [
          'Nhin mo dot ngot, thay cham den bay, chot sang, dau nhuc mat du doi, mat do keo dai can duoc kham som.',
          'Co chan thuong vung mat, hoa chat ban vao mat hoac sut thi luc nhanh la tinh huong can xu ly khan.',
        ],
      },
      {
        heading: 'Sai lam thuong gap khi co trieu chung mat',
        paragraphs: [
          'Tu mua thuoc nho mat khong ro nguon goc hoac tri hoan kham de tu theo doi tai nha la sai lam pho bien.',
          'Mot so benh ly nhu bong vong mac co cua so vang dieu tri rat ngan, can den co so y te kip thoi.',
        ],
      },
      {
        heading: 'Lo trinh xu ly an toan cho nguoi dung',
        paragraphs: [
          'Buoc 1: dung lai cong viec va ghi nhan trieu chung. Buoc 2: lien he co so y te chuyen khoa. Buoc 3: di kham som.',
          'Neu co dau hieu cap tinh, uu tien den benh vien co khoa mat thay vi cho doi trieu chung tu giam.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Dau mat kem nhin mo co can di cap cuu khong?',
        answer:
          'Neu xuat hien dot ngot hoac kem chot sang, cham den bay, can di kham cap cuu nhan khoa som.',
      },
      {
        question: 'Do mat do nhe co can di kham ngay?',
        answer:
          'Neu mat do keo dai, kem dau, so anh sang hoac giam thi luc thi nen di kham ngay de loai tru benh ly nghiem trong.',
      },
    ],
  },
];

export const clusterBySlug = Object.fromEntries(clusters.map((cluster) => [cluster.slug, cluster]));

export const articleBySlug = Object.fromEntries(
  articles.map((article) => [`${article.clusterSlug}/${article.slug}`, article])
);

export const getClusterArticles = (clusterSlug: string) =>
  articles.filter((article) => article.clusterSlug === clusterSlug);
