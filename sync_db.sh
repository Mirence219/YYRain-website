#!/bin/bash

cp data.db data_backup_$(date +%Y%m%d).db
rsync -avz data.db ubuntu@服务器IP:/home/YYRain-website/
ssh ubuntu@服务器IP << EOF
chown ubuntu:ubuntu /home/YYRain-website/data.db
chmod 664 /home/YYRain-website/data.db
systemctl restart yyr-website
echo "数据库同步完成"
EOF