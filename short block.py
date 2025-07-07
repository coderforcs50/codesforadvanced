#please write this in anaconda and first install pygame
import pygame, random
pygame.init()
s,w,h=pygame.display.set_mode((800,600)),800,600
p=pygame.Rect(w//2-60,h-30,120,20)
b=pygame.Rect(w//2-10,h//2,20,20)
v=[4,-4]
lives,score=3,0
blocks=[pygame.Rect(10+c*65,50+r*35,60,30)for r in range(5)for c in range(12)]
running=True
while running:
 s.fill((0,0,0))
 for e in pygame.event.get():
  if e.type==pygame.QUIT:running=False
 k=pygame.key.get_pressed()
 if k[pygame.K_LEFT]:p.x-=8
 if k[pygame.K_RIGHT]:p.x+=8
 b.x+=v[0];b.y+=v[1]
 if b.left<=0 or b.right>=w:v[0]*=-1
 if b.top<=0:v[1]*=-1
 if p.colliderect(b):v[1]*=-1
 hit=[blk for blk in blocks if blk.colliderect(b)]
 for blk in hit:blocks.remove(blk);v[1]*=-1;score+=10
 if b.bottom>=h:lives-=1;b.x,b.y=w//2,h//2
 if lives==0 or not blocks:running=False
 for blk in blocks:pygame.draw.rect(s,(255,50,50),blk)
 pygame.draw.rect(s,(50,255,50),p)
 pygame.draw.ellipse(s,(255,255,0),b)
 s.blit(pygame.font.SysFont("Arial",24).render(f"Score:{score} Lives:{lives}",1,(255,255,255)),(10,10))
 pygame.display.flip();pygame.time.Clock().tick(60)
pygame.quit()
