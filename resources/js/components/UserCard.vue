<template>
  <div class="card-wrapper">
    <!-- Barber pole top right -->
    <div class="barber-pole">
      <div class="pole-stripes"></div>
    </div>

    <!-- Role badge -->
    <div class="role-badge">
      <span>{{ role }}</span>
    </div>

    <!-- Action buttons left -->
    <div class="action-buttons">
      <button class="action-btn view-btn" @click="$emit('view')" title="Ver">
        <span class="btn-inner">👁</span>
      </button>
      <button class="action-btn edit-btn" @click="$emit('edit')" title="Editar">
        <span class="btn-inner">✏️</span>
      </button>
      <button class="action-btn delete-btn" @click="$emit('delete')" title="Eliminar">
        <span class="btn-inner">🗑</span>
      </button>
    </div>

    <!-- Avatar -->
    <div class="avatar-container">
      <img :src="avatar || '/storage/avatars/default.png'" :alt="name" class="avatar-img" />
    </div>

    <!-- Name plate -->
    <div class="name-plate">
      <div class="plate-border">
        <span class="plate-name">{{ name.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: 'Pedro Perez' },
  role: { type: String, default: 'Cliente' },
  avatar: { type: String, default: null },
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cinzel:wght@700&display=swap');

.card-wrapper {
  position: relative;
  width: 260px;
  height: 340px;
  background: radial-gradient(ellipse at 30% 20%, #3a3a3a 0%, #1a1a1a 50%, #0d0d0d 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0,0,0,0.8),
    inset 0 1px 0 rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 24px;
  user-select: none;
}

/* ─── BARBER POLE ─────────────────────────── */
.barber-pole {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 120px;
  overflow: hidden;
  border-radius: 0 20px 0 0;
}

.pole-stripes {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    -45deg,
    #c0392b 0px,
    #c0392b 8px,
    #fff    8px,
    #fff    16px,
    #2471a3 16px,
    #2471a3 24px,
    #fff    24px,
    #fff    32px
  );
  animation: pole-spin 3s linear infinite;
}

@keyframes pole-spin {
  from { background-position: 0 0; }
  to   { background-position: 0 64px; }
}

/* ─── ROLE BADGE ──────────────────────────── */
.role-badge {
  position: absolute;
  top: 16px;
  right: 44px;
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 4px 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
}

.role-badge span {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  color: #fff;
  letter-spacing: 1px;
}

/* ─── ACTION BUTTONS ──────────────────────── */
.action-buttons {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-60%);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative;
}

.action-btn:active {
  transform: scale(0.93);
}

.btn-inner {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.5));
}

/* View — azul oscuro 3D */
.view-btn {
  background: radial-gradient(circle at 35% 30%, #5b8dd9, #1a3a6b);
  box-shadow:
    0 6px 0 #0d1f3c,
    0 8px 16px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.3);
}
.view-btn:hover {
  box-shadow:
    0 8px 0 #0d1f3c,
    0 10px 20px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

/* Edit — dorado 3D */
.edit-btn {
  background: radial-gradient(circle at 35% 30%, #c9a84c, #7a6020);
  box-shadow:
    0 6px 0 #3d3010,
    0 8px 16px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.3);
}
.edit-btn:hover {
  box-shadow:
    0 8px 0 #3d3010,
    0 10px 20px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

/* Delete — rojo oscuro 3D */
.delete-btn {
  background: radial-gradient(circle at 35% 30%, #c0392b, #6b1515);
  box-shadow:
    0 6px 0 #3c0b0b,
    0 8px 16px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.2);
}
.delete-btn:hover {
  box-shadow:
    0 8px 0 #3c0b0b,
    0 10px 20px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

/* ─── AVATAR ──────────────────────────────── */
.avatar-container {
  width: 170px;
  height: 200px;
  margin-bottom: 12px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  filter: drop-shadow(0 -4px 20px rgba(0,0,0,0.8));
}

/* ─── NAME PLATE ──────────────────────────── */
.name-plate {
  width: 85%;
}

.plate-border {
  background: linear-gradient(135deg, #2471a3, #1a5276);
  border-radius: 6px;
  padding: 2px;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.2);
  /* vintage stripe border */
  border-top: 4px solid #c0392b;
  border-bottom: 4px solid #c0392b;
}

.plate-name {
  display: block;
  text-align: center;
  font-family: 'Cinzel', serif;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 3px;
  padding: 6px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}
</style>