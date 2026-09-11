import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { create } from 'zustand'

type Lang = 'ar' | 'fr' | 'en'
interface LangState { lang: Lang | null; setLang: (l: Lang) => void }

export const useLanguageStore = create<LangState>((set) => ({
  lang: (localStorage.getItem('lang') as Lang) || null,
  setLang: (lang) => { 
    localStorage.setItem('lang', lang); 
    i18n.changeLanguage(lang); 
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    set({ lang }) 
  }
}))

const resources = {
  en: {
    translation: {
      home: 'Home', client: 'Client', driver: 'Driver', admin: 'Admin',
      ride: 'Ride', colis: 'Parcel', cargo: 'Cargo', rental: 'Rental', makla: 'Food', souk: 'Market', heavy: 'Heavy',
      request: 'Request', accept: 'Accept', price: 'Price', distance: 'Distance', weight: 'Weight',
      select_services: 'Select your services', choose_services_desc: 'Choose what you want to work with.',
      desc_ride: 'Transport passengers', desc_colis: 'Small parcels', desc_cargo: 'Heavy cargo', desc_rental: 'Vehicle rental', desc_makla: 'Food delivery',
      continue_with: 'Continue with', services: 'services', saving: 'Saving...',
      all: 'All', active: 'Active', pending: 'Pending', accepted: 'Accepted', delivered: 'Delivered',
      from: 'From', to: 'To', waiting: 'Waiting for', orders: 'orders', new: 'New', loading: 'Loading...', DZD: 'DZD',
      all_services: 'All Services', night: 'Night', day: 'Day', group: 'Shared', private: 'Private', fee: 'fee',
      moto: 'Moto', car: 'Car', order_food: 'Order Food', with_driver: 'With driver', city: 'City', day_label: 'day',
      pickup_address: 'Pickup address', dropoff_address: 'Dropoff address', description: 'Description', delivery: 'Delivery', weight_kg: 'Weight (kg)', order_created: 'Order created', processing: 'Processing...', send: 'Send', pickup_dropoff_required: 'Pickup and dropoff required',
      origin: 'Origin', destination: 'Destination', cargo_type: 'Cargo type', transport: 'Transport', weight_tons: 'Weight (tons)', cargo_order_created: 'Cargo order created', origin_dest_required: 'Origin and destination required',
      delivery_address: 'Delivery address', restaurant_name: 'Restaurant name', order_items: 'Order items', phone_number: 'Phone', order_placed: 'Order placed', order_now: 'Order Now', address_items_required: 'Address and items required',
      pickup_location: 'Pickup location', vehicle_type: 'Vehicle type', duration_days: 'Duration (days)', vehicle: 'Vehicle', rental_created: 'Rental created', reserve: 'Reserve', location_date_required: 'Location and date required',
      choose_service: 'Choose a service', fill_addresses: 'Fill addresses', done: 'Done', fill_form: 'Complete form'
    }
  },
  fr: {
    translation: {
      home: 'Accueil', client: 'Client', driver: 'Chauffeur', admin: 'Admin',
      ride: 'Course', colis: 'Colis', cargo: 'Cargo', rental: 'Location', makla: 'Repas', souk: 'Marché', heavy: 'Déménagement',
      request: 'Demander', accept: 'Accepter', price: 'Prix', distance: 'Distance', weight: 'Poids',
      select_services: 'Sélectionnez vos services', choose_services_desc: 'Choisissez vos services.',
      desc_ride: 'Transport', desc_colis: 'Petits colis', desc_cargo: 'Cargaison', desc_rental: 'Location véhicule', desc_makla: 'Livraison',
      continue_with: 'Continuer avec', services: 'services', saving: 'Enregistrement...',
      all: 'Tous', active: 'Actif', pending: 'En attente', accepted: 'Accepté', delivered: 'Livré',
      from: 'De', to: 'Vers', waiting: 'En attente', orders: 'commandes', new: 'Nouveau', loading: 'Chargement...', DZD: 'DZD',
      all_services: 'Tous les services', night: 'Nuit', day: 'Jour', group: 'Partagé', private: 'Privé', fee: 'frais',
      moto: 'Moto', car: 'Voiture', order_food: 'Commander', with_driver: 'Avec chauffeur', city: 'Ville', day_label: 'jour',
      pickup_address: 'Adresse de ramassage', dropoff_address: 'Adresse de dépôt', description: 'Description', delivery: 'Livraison', weight_kg: 'Poids (kg)', order_created: 'Commande créée', processing: 'Traitement...', send: 'Envoyer', pickup_dropoff_required: 'Ramassage et dépôt requis',
      origin: 'Origine', destination: 'Destination', cargo_type: 'Type', transport: 'Transport', weight_tons: 'Poids (t)', cargo_order_created: 'Commande créée', origin_dest_required: 'Origine et destination requises',
      delivery_address: 'Adresse livraison', restaurant_name: 'Restaurant', order_items: 'Articles', phone_number: 'Téléphone', order_placed: 'Commande passée', order_now: 'Commander', address_items_required: 'Adresse et articles requis',
      pickup_location: 'Lieu de ramassage', vehicle_type: 'Type véhicule', duration_days: 'Durée (jours)', vehicle: 'Véhicule', rental_created: 'Location créée', reserve: 'Réserver', location_date_required: 'Lieu et date requis',
      choose_service: 'Choisir un service', fill_addresses: 'Remplir les adresses', done: 'Terminé', fill_form: 'Compléter'
    }
  },
  ar: {
    translation: {
      home: 'الرئيسية', client: 'زبون', driver: 'سائق', admin: 'إدارة',
      ride: 'توصيل', colis: 'طرد', cargo: 'شحن', rental: 'كراء', makla: 'أكل', souk: 'سوق', heavy: 'ترحيل',
      request: 'طلب', accept: 'قبول', price: 'السعر', distance: 'المسافة', weight: 'الوزن',
      select_services: 'اختر خدماتك', choose_services_desc: 'اختر ما تريد العمل به.',
      desc_ride: 'نقل الأشخاص', desc_colis: 'طرود صغيرة', desc_cargo: 'طرود كبيرة', desc_rental: 'كراء سيارة مع سائق', desc_makla: 'توصيل الطعام',
      continue_with: 'المتابعة مع', services: 'خدمات', saving: 'جاري الحفظ...',
      all: 'الكل', active: 'النشطة', pending: 'المعلقة', accepted: 'مقبولة', delivered: 'تم التوصيل',
      from: 'من', to: 'إلى', waiting: 'في انتظار', orders: 'الطلبات', new: 'جديد', loading: 'جاري التحميل...', DZD: 'دج',
      all_services: 'كل الخدمات', night: 'ليل', day: 'نهار', group: 'جماعي', private: 'خاص', fee: 'العمولة',
      moto: 'دراجة', car: 'سيارة', order_food: 'طلب أكل', with_driver: 'مع سائق', city: 'مدينة', day_label: 'يوم',
      pickup_address: 'عنوان الاستلام', dropoff_address: 'عنوان التوصيل', description: 'الوصف', delivery: 'توصيل', weight_kg: 'الوزن (كغ)', order_created: 'تم إنشاء الطلب', processing: 'جاري المعالجة...', send: 'إرسال', pickup_dropoff_required: 'الاستلام والتوصيل مطلوبان',
      origin: 'المنطلق', destination: 'الوجهة', cargo_type: 'نوع الشحنة', transport: 'نقل', weight_tons: 'الوزن (طن)', cargo_order_created: 'تم إنشاء طلب الشحن', origin_dest_required: 'المنطلق والوجهة مطلوبان',
      delivery_address: 'عنوان التوصيل', restaurant_name: 'اسم المطعم', order_items: 'الطلبات', phone_number: 'رقم الهاتف', order_placed: 'تم الطلب بنجاح', order_now: 'اطلب الآن', address_items_required: 'العنوان والطلبات مطلوبان',
      pickup_location: 'مكان الاستلام', vehicle_type: 'نوع السيارة', duration_days: 'المدة (أيام)', vehicle: 'كراء سيارة', rental_created: 'تم إنشاء طلب الكراء', reserve: 'احجز', location_date_required: 'المكان والتاريخ مطلوبان',
      choose_service: 'اختر الخدمة', fill_addresses: 'أدخل العناوين', done: 'تم', fill_form: 'أكمل البيانات'
    }
  }
}

i18n.use(initReactI18next).init({ resources, lng: localStorage.getItem('lang') || 'ar', fallbackLng: 'ar', interpolation: { escapeValue: false } })
export default i18n
