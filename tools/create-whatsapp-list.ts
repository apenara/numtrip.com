import * as fs from 'fs';
import * as path from 'path';

interface Place {
  name: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  formatted_address?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  customDisplayName?: string;
}

interface WhatsAppContact {
  displayName: string;
  officialName: string;
  phone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  address: string;
  rating: string;
  website: string;
  hasContact: boolean;
}

function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  // If it starts with 57, keep it, otherwise add 57 (Colombia code)
  if (!cleaned.startsWith('57')) {
    cleaned = '57' + cleaned;
  }
  return cleaned;
}

function createWhatsAppList() {
  try {
    // Read the JSON data
    const jsonPath = path.join(__dirname, 'specific-places-cartagena.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const contacts: WhatsAppContact[] = [];

    data.places.forEach((place: Place) => {
      const phone = place.formatted_phone_number || place.international_phone_number || '';
      const whatsappNumber = formatPhoneForWhatsApp(phone);
      const hasContact = !!phone;

      contacts.push({
        displayName: place.customDisplayName || place.name,
        officialName: place.name,
        phone: phone,
        whatsappNumber: whatsappNumber,
        whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '',
        address: place.formatted_address || 'Cartagena, Colombia',
        rating: place.rating ? `${place.rating}/5 (${place.user_ratings_total || 0} reseñas)` : 'Sin rating',
        website: place.website || 'No disponible',
        hasContact: hasContact
      });
    });

    // Sort by name
    contacts.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Create WhatsApp contact list
    let whatsappList = '🏖️ LISTA DE CONTACTOS WHATSAPP - BEACH CLUBS CARTAGENA 🏖️\n\n';
    whatsappList += `📅 Generado: ${new Date().toLocaleDateString('es-CO')}\n`;
    whatsappList += `📍 Total de lugares: ${contacts.length}\n`;
    whatsappList += `✅ Con WhatsApp: ${contacts.filter(c => c.hasContact).length}\n\n`;
    whatsappList += '═'.repeat(60) + '\n\n';

    contacts.forEach((contact, index) => {
      whatsappList += `${index + 1}. ${contact.displayName}\n`;
      whatsappList += `   📞 ${contact.phone || 'No disponible'}\n`;
      if (contact.hasContact) {
        whatsappList += `   💬 ${contact.whatsappUrl}\n`;
      }
      whatsappList += `   📍 ${contact.address.split(',').slice(0, 2).join(',')}\n`;
      whatsappList += `   ⭐ ${contact.rating}\n`;
      if (contact.website !== 'No disponible') {
        whatsappList += `   🌐 ${contact.website}\n`;
      }
      whatsappList += '\n';
    });

    // Create CSV for easy import
    const csvHeader = 'Nombre,Teléfono,WhatsApp URL,Dirección,Rating,Website,Tiene Contacto\n';
    const csvRows = contacts.map(contact => [
      `"${contact.displayName}"`,
      `"${contact.phone}"`,
      `"${contact.whatsappUrl}"`,
      `"${contact.address}"`,
      `"${contact.rating}"`,
      `"${contact.website}"`,
      contact.hasContact ? 'Sí' : 'No'
    ].join(','));

    const csvContent = csvHeader + csvRows.join('\n');

    // Create message templates
    const messageTemplate = `🏖️ ¡Hola! Te contactamos desde NumTrip.com

Somos un directorio de turismo verificado en Cartagena y queremos incluir tu beach club/hotel en nuestra plataforma.

✨ BENEFICIOS GRATUITOS:
• Perfil completo con fotos y descripción
• Contacto verificado (WhatsApp, teléfono, email)
• Aparición en búsquedas de turistas
• Badge de "Verificado" ✅

¿Te interesa que incluyamos [NOMBRE DEL LUGAR] en nuestro directorio?

¡Es completamente GRATIS! 🎉

Saludos,
Equipo NumTrip.com
🌐 www.numtrip.com`;

    // Save files
    const whatsappPath = path.join(__dirname, 'whatsapp-contacts-list.txt');
    const csvPath = path.join(__dirname, 'whatsapp-contacts.csv');
    const templatePath = path.join(__dirname, 'message-template.txt');

    fs.writeFileSync(whatsappPath, whatsappList);
    fs.writeFileSync(csvPath, csvContent);
    fs.writeFileSync(templatePath, messageTemplate);

    console.log('📱 LISTA DE CONTACTOS WHATSAPP CREADA');
    console.log('═'.repeat(50));
    console.log(`📄 Lista completa: ${whatsappPath}`);
    console.log(`📊 Archivo CSV: ${csvPath}`);
    console.log(`💬 Template de mensaje: ${templatePath}`);
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`• Total lugares: ${contacts.length}`);
    console.log(`• Con WhatsApp: ${contacts.filter(c => c.hasContact).length}`);
    console.log(`• Sin contacto: ${contacts.filter(c => !c.hasContact).length}`);

    console.log('\n💬 LUGARES CON WHATSAPP:');
    contacts.filter(c => c.hasContact).forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.displayName} - ${contact.whatsappUrl}`);
    });

    console.log('\n❌ LUGARES SIN CONTACTO:');
    contacts.filter(c => !c.hasContact).forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.displayName}`);
    });

  } catch (error) {
    console.error('Error creando lista de WhatsApp:', error);
  }
}

createWhatsAppList();