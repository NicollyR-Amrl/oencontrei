@echo off
git add .
set /p msg="Digite a mensagem do commit: "
git commit -m "%msg%"
git push
echo.
echo Codigo enviado para o GitHub com sucesso!
pause
