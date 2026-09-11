export const getT = (lang:string)=>{
  const isAr = lang==='ar'
  return {
    ride: isAr?'توصيلة': lang==='fr'?'Course':'Ride',
    parcel: isAr?'طرد': lang==='fr'?'Colis':'Parcel',
    rental: isAr?'كراء سيارة': lang==='fr'?'Location':'Rental',
    customer: isAr?'زبون': lang==='fr'?'Client':'Customer',
    driver: isAr?'سائق': lang==='fr'?'Chauffeur':'Driver',
    total: isAr?'المجموع': 'Total',
    confirmRide: isAr?'تأكيد التوصيلة': lang==='fr'?'Confirmer':'Confirm Ride',
    sendParcel: isAr?'إرسال الطرد': lang==='fr'?'Envoyer':'Send Parcel',
    confirmRental: isAr?'تأكيد الكراء': lang==='fr'?'Confirmer':'Confirm Rental',
    accept: isAr?'قبول': lang==='fr'?'Accepter':'Accept',
    online: isAr?'متصل': lang==='fr'?'En ligne':'Online',
    from: isAr?'من': lang==='fr'?'De':'From',
    to: isAr?'إلى': lang==='fr'?'À':'To',
    enterCode: isAr?'أدخل الكود السري': lang==='fr'?'Code secret':'Enter secret code',
    login: isAr?'دخول': lang==='fr'?'Connexion':'Login',
    special: isAr?'خاص': lang==='fr'?'Privé':'Private',
    group: isAr?'جماعة': lang==='fr'?'Groupe':'Group',
    small: isAr?'صغير': lang==='fr'?'Petit':'Small',
    large: isAr?'كبير': lang==='fr'?'Grand':'Large',
    light: isAr?'Light': 'Light',
    cargo: isAr?'Cargo': 'Cargo',
    chooseDest: isAr?'اختر وجهتك': lang==='fr'?'Choisir destination':'Choose destination',
    whoAreYou: isAr?'هل أنت زبون أم سائق؟': lang==='fr'?'Vous êtes client ou chauffeur ?':'Are you customer or driver ?',
    fmtPrice: (n:number)=> isAr? `${Math.round(n)} دج` : `DZD ${Math.round(n)}`
  }
}
