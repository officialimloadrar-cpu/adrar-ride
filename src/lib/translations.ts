export const getT = (lang:string)=>{
  const isAr = lang==='ar'
  return {
    ride: isAr?'توصيلة': lang==='fr'?'Course':'Ride',
    parcel: isAr?'طرد': lang==='fr'?'Colis':'Parcel',
    driver: isAr?'سائق': lang==='fr'?'Chauffeur':'Driver',
    total: isAr?'المجموع': 'Total',
    confirmRide: isAr?'تأكيد التوصيلة': lang==='fr'?'Confirmer':'Confirm Ride',
    sendParcel: isAr?'إرسال الطرد': lang==='fr'?'Envoyer':'Send Parcel',
    accept: isAr?'قبول': lang==='fr'?'Accepter':'Accept',
    online: isAr?'متصل': lang==='fr'?'En ligne':'Online',
    from: isAr?'من': lang==='fr'?'De':'From',
    to: isAr?'إلى': lang==='fr'?'À':'To',
    enterCode: isAr?'أدخل الكود السري': lang==='fr'?'Code secret':'Enter secret code',
    login: isAr?'دخول': lang==='fr'?'Connexion':'Login',
    fmtPrice: (n:number)=> isAr? `${n} دج` : `DZD ${n}`
  }
}
