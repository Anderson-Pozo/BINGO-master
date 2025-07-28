import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TermsModal = ({ open, onClose, onAccept }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Texto estático de términos y condiciones (puede ser cambiado a dinámico después)
  const termsText = `
TÉRMINOS Y CONDICIONES DE VENTA DE TABLAS - BINGO BINGO 
1. IDENTIFICACIÓN DEL ORGANIZADOR 
Bingo Bingo es una empresa legalmente constituida como plataforma de entretenimiento 
online. Cualquier inquietud, reclamo o solicitud de información respecto a la compra de 
tablas y participación en los sorteos puede canalizarse mediante el número de atención 
directa: 0995707706. 
2. NATURALEZA DEL SORTEO 
El evento promovido por Bingo Bingo es un bingo digital con fines recreativos y 
promocionales. Su objetivo principal es brindar una experiencia de entretenimiento, 
permitiendo a los usuarios participar en sorteos online de forma segura y accesible. La 
participación es voluntaria y no constituye un juego de azar bajo regulación estatal de 
loterías. 
3. REQUISITOS PARA PARTICIPAR 
Para ser parte del sorteo, el participante debe: 
 Tener al menos 18 años de edad. 
 Adquirir su tabla de forma directa en los canales autorizados por Bingo Bingo. 
 Poseer una tabla válida y activa para el sorteo en cuestión. 
Cada tabla es generada únicamente para el sorteo del 16 de agosto de 2025 y cuenta con un 
diseño, números y orden aleatorios. Las tablas no son reutilizables ni válidas para futuros 
sorteos. Esta rotación garantiza la transparencia y la seguridad del proceso para todos los 
participantes. 
4. PRECIO Y MEDIOS DE PAGO 
 El valor de participación es de $1 USD por tabla. 
 Métodos de pago habilitados: 
o PayPhone (tarjeta o transferencia): con comisión del 5% + 15% de IVA, 
asumidos por el comprador. 
o Venta manual a través de vendedores identificados por la organización. 
Bingo Bingo no se responsabiliza por pagos realizados a personas no autorizadas. 
5. VALIDEZ DE LA TABLA 
Cada tabla es única, intransferible y solo válida para el sorteo del 16 de agosto de 2025. 
Su compra implica la aceptación de todos los términos y condiciones establecidos. 
6. DETALLES DEL SORTEO 
 Fecha: 16 de agosto de 2025 
 Hora: 7:00 PM 
 Transmisión en vivo a través de: 
o Redes sociales del sorteo (Facebook, Instagram y TikTok) 
o Canal oficial de YouTube 
o Plataforma: https://bingobingo.live/ 
Los participantes deben contar con acceso a internet estable para seguir el evento en vivo. 
No se aceptarán reclamos por problemas de conexión del usuario. 
7. PREMIO Y ENTREGA 
En caso de existir más de un ganador con combinación válida según las reglas del sorteo, se 
procederá a realizar un sorteo interno entre los posibles ganadores, en vivo y de forma 
pública. La persona seleccionada como ganadora de dicho sorteo recibirá el premio mayor. 
Los demás participantes en ese empate recibirán premios consuelo, definidos por la 
organización y comunicados oportunamente. 
�
� Premio Mayor: 
Camioneta Datsun 1200 restaurada, con papeles al día. 
 El vehículo se encuentra en condiciones de funcionamiento y fue restaurado para 
fines promocionales. 
 No cuenta con garantía mecánica. Bingo Bingo no se responsabiliza por futuros 
desperfectos derivados del uso o desgaste natural del vehículo. 
 La entrega del premio se realizará en la ciudad de Tulcán, Ecuador. 
 El ganador deberá: 
o Acercarse personalmente a retirar el premio en días laborables. 
o Realizar el trámite de traspaso notariado y firma de documentos legales. 
o Cumplir con el proceso en un plazo máximo de 8 días posteriores al sorteo. 
La entrega será registrada audiovisual y el ganador acepta expresamente que dicho 
material podrá ser utilizado con fines promocionales por Bingo Bingo para futuras 
campañas. 
8. DEVOLUCIONES 
Bajo ningún concepto se realizará la devolución del valor adquirido por la compra de 
tablas. 
Únicamente se contempla devolución en caso de cancelación del sorteo por motivos de 
fuerza mayor. 
9. PAGOS NO AUTORIZADOS 
Bingo Bingo no se responsabiliza por pérdidas, fraudes o inconvenientes generados por 
pagos manuales gestionados por terceros a través de medios no autorizados. 
10. MÍNIMO DE COMPRA Y USO DE IMAGEN 
 El valor de la tabla es de $1 USD. El número mínimo de compra por participante 
es de 5 tablas. 
 El comprador acepta que su imagen y nombre pueden ser utilizados para fines 
promocionales en caso de resultar ganador. 
11. MODIFICACIONES 
Bingo Bingo se reserva el derecho de modificar las fechas, condiciones o dinámica del 
sorteo por causas de fuerza mayor, con previo aviso público a través de sus canales 
oficiales. 
12. ACEPTACIÓN DE TÉRMINOS 
Al adquirir una tabla, el participante declara haber leído, entendido y aceptado la totalidad 
de los presentes términos y condiciones. 
  `;

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          minHeight: fullScreen ? '100vh' : '70vh',
          maxHeight: fullScreen ? '100vh' : '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          py: 2
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Términos y Condiciones
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa'
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: { xs: 2, sm: 3 },
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textAlign: 'justify'
            }}
          >
            {termsText}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: { xs: 100, sm: 120 },
            mr: 1
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          sx={{
            minWidth: { xs: 100, sm: 120 },
            fontWeight: 'bold'
          }}
        >
          Acepto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsModal;
