:: アクションリストをドラッグアンドドロップしてサブステータス最適化モードを使うためのbatファイル

:: よく分かりません。元にしたbatファイルに書いてあったので残しておきます
set argument="%2"

:: ドラッグアンドドロップでアクションリストの絶対パスをfilename_pathに代入
set filename_path=%~1

:: アクションリストのファイル名（拡張子なし）をfilenameに代入
set filename=%~n1

:: batファイルのあるフォルダに移動する
cd /d %~dp0

:: アクションリストのファイル名と同名のフォルダがないか判定する
if not exist "%filename%" (
	:: ない場合にのみ同名のフォルダを作る
	mkdir "%filename%"
)

:: 出力するファイルの名前の一部をoutputに代入
set output="%filename%.json"

:: サブステータス最適化
:: 最適化前のアクションリストの読み込み
:: 最適化済みのアクションリストファイルを同名のフォルダに保存
"gcsim.exe" -c="%filename_path%" -substatOptim=true -out="%filename%/%filename%.txt" %argument%

:: 最適化済みのアクションリストを使ってシミュレーションをします
"gcsim.exe" -c="%filename%/%filename%.txt" -out="%filename%/%output%" -gz="true" %argument%

:: 処理の終了後にコマンドプロンプトを閉じないための処理です
:: 不必要であれば消しても構いません
cmd /k
