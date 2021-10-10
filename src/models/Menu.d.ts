export interface MenuItem {
  name: string;
  href?: string;
  children?: Array<MenuItem>;
}

export interface SocialMenuItem extends MenuItem {
  icon: string;
}

export interface Menu extends MenuItem {
  phone: string;
  social: Array<SocialMenuItem>;
}
