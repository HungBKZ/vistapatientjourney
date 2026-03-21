import { useLocation } from 'react-router-dom';
import { useSeo } from './useSeo';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VISTA Patient Journey',
  url: 'https://vistapatientjourney.vn',
  logo: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg',
  sameAs: ['https://www.facebook.com/profile.php?id=61581889931780'],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+84-388-833-157',
      contactType: 'customer support',
      areaServed: 'VN',
      availableLanguage: ['vi', 'en'],
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'VISTA Patient Journey',
  url: 'https://vistapatientjourney.vn',
  inLanguage: 'vi-VN',
};

type RouteMeta = {
  title: string;
  description: string;
};

const routeMetaMap: Record<string, RouteMeta> = {
  '/': {
    title: 'VISTA Patient Journey | AI mo phong benh ly nhan khoa',
    description:
      'Nen tang nang cao nhan thuc suc khoe mat voi AI mo phong benh ly nhan khoa, noi dung giao duc va cong cu trai nghiem truc quan.',
  },
  '/knowledge': {
    title: 'Mat ao VISTA | Trai nghiem thi giac bang AI',
    description:
      'Trai nghiem mo phong thi giac va kiem tra thi luc voi cong nghe AI de hieu ro hon ve suc khoe doi mat.',
  },
  '/explore': {
    title: 'Kien thuc suc khoe mat | Quiz, Podcast, Video | VISTA',
    description:
      'Kham pha kien thuc suc khoe mat qua quiz, podcast va video de hoc nhanh, de nho, de ap dung.',
  },
  '/journey': {
    title: 'Hanh trinh du an VISTA | Tu lop hoc den benh vien',
    description:
      'Theo doi hanh trinh VISTA voi cac cot moc trien khai thuc te, hop tac benh vien va ghi nhan tu truyen thong.',
  },
  '/quiz': {
    title: 'Quiz suc khoe mat | Kiem tra kien thuc nhanh',
    description:
      'Lam quiz suc khoe mat de tu danh gia kien thuc va nhan goi y cai thien thoi quen bao ve thi luc.',
  },
  '/podcast': {
    title: 'Podcast suc khoe mat | VISTA',
    description:
      'Nghe podcast suc khoe mat voi cac chu de nhan khoa de cap nhat kien thuc moi ngay.',
  },
  '/video': {
    title: 'Video huong dan suc khoe mat | VISTA Learning',
    description:
      'Xem video huong dan ve benh ly mat, cham soc mat va kinh nghiem thuc hanh de bao ve thi luc.',
  },
  '/kien-thuc': {
    title: 'Trung tam kien thuc mat | Hub SEO VISTA',
    description:
      'Trang hub kien thuc mat gom 3 cluster uu tien: tat khuc xa, benh ly pho bien, cham soc mat do man hinh.',
  },
  '/privacy-policy': {
    title: 'Chinh sach bao mat | VISTA Patient Journey',
    description: 'Thong tin chinh sach bao mat va cach VISTA xu ly du lieu nguoi dung.',
  },
  '/terms-of-service': {
    title: 'Dieu khoan dich vu | VISTA Patient Journey',
    description: 'Dieu khoan va dieu kien su dung dich vu tren website VISTA Patient Journey.',
  },
};

export default function RouteSeo() {
  const location = useLocation();

  const routeMeta = routeMetaMap[location.pathname] || {
    title: 'VISTA Patient Journey',
    description: 'Nen tang giao duc suc khoe mat va trai nghiem thi giac AI.',
  };

  useSeo({
    ...routeMeta,
    path: location.pathname,
    schema: [orgSchema, websiteSchema],
  });

  return null;
}
