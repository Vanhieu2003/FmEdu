import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview v5.7.0',
        items: [
          { title: 'Đánh giá', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Danh sách đánh giá', path: paths.dashboard.two, icon: ICONS.ecommerce },
          {
            title: 'three',
            path: paths.dashboard.three,
            icon: ICONS.analytics,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'Admin',
            path: paths.dashboard.group.root,
            icon: ICONS.user,
            children: [
              { title: 'Form', path: paths.dashboard.group.root },
              { title: 'Tiêu chí', path: paths.dashboard.group.five },
              { title: 'six', path: paths.dashboard.group.six },
            ],
          },
          {
            title: 'Quản lý Nhóm Phòng',
            path: paths.dashboard.roomgroup.root,
            icon: ICONS.lock,
            children: [
              { title: 'Danh sách nhóm', path: paths.dashboard.roomgroup.list },
              { title: 'Tạo nhóm', path: paths.dashboard.roomgroup.create },
              { title: 'Chính sửa nhóm', path: paths.dashboard.roomgroup.root },
            ],
          },

          {
            title: 'Nhóm người chịu trách nhiệm',
            path: paths.dashboard.responsiblegroup.root,
            icon: ICONS.lock,
            children: [
              { title: 'Danh sách nhóm', path: paths.dashboard.responsiblegroup.list },
              { title: 'Tạo nhóm', path: paths.dashboard.responsiblegroup.create },
              { title: 'Chỉnh sửa nhóm', path: paths.dashboard.responsiblegroup.root },
              { title: 'Tạo tag cho người chịu trách nhiệm', path: paths.dashboard.responsiblegroup.createUserPerTag},
            ],
          },
        ],
      },
    ],
    []
  );

  return data;
}
