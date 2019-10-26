<?php

$jsonify = True;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
if(isset($_GET['raw'])){
  if($_GET['raw'] == 1){
    header('Content-Type: text/plain');
    header('Content-disposition: attachment; filename="data.dat"');
    $jsonify = False;
  }
}

function calc($mathString)    {
  $mathString = trim($mathString);
  $mathString = str_replace ('[^0-9\+-\*\/\(\) ]', '', $mathString);

  $compute = create_function("", "return (" . $mathString . ");" );
  return 0 + $compute();
}

function array2csv($a){
  $out = "#Time\tTheta\tOmega";
  foreach($a as $e){
    $out .= sprintf("\n%.14f\t%.14f\t%.14f", $e[0], $e[1], $e[2]);
    //$out .= "\n" . $e[0] . "\t" . $e[1] . "\t" . $e[2];
  }
  return $out;
}

function f($t, $omega, $theta, $gamma, $alpha, $omega_d){
	return -sin($theta) - 2*$gamma*$omega + $alpha*sin($omega_d*$t);
}

$omega_d = isset($_GET['omega_d']) ? calc($_GET['omega_d']) : 0;
$alpha = isset($_GET['alpha']) ? calc($_GET['alpha']) : 0;
$gamma = isset($_GET['gamma']) ? calc($_GET['gamma']) : 0;

$n = isset($_GET['step_count']) ? min(calc($_GET['step_count']), 500000) : 0;
$dt = isset($_GET['dt']) ? calc($_GET['dt']) : 0.1;
$theta = isset($_GET['initial_theta']) ? calc($_GET['initial_theta']) : 0;
$omega = isset($_GET['initial_omega']) ? calc($_GET['initial_omega']) : 0;

$results = array(
  array(0, $theta, $omega)
);

for($i = 1; $i < $n; $i++){
  $t = $results[$i-1][0];
  $theta = $results[$i-1][1];
  $omega = $results[$i-1][2];

  $m0 = f($t, $omega, $theta, $gamma, $alpha, $omega_d);
  $m1 = f($t+0.5*$dt, $omega+0.5*$m0*$dt, $theta, $gamma, $alpha, $omega_d);
  $m2 = f($t+0.5*$dt, $omega+0.5*$m1*$dt, $theta, $gamma, $alpha, $omega_d);
  $m3 = f($t+$dt, $omega+$m2*$dt, $theta, $gamma, $alpha, $omega_d);

  array_push($results, array(
    $t + $dt,
    $theta + $omega*$dt,
    $omega + ($m0+2*$m1+2*$m2+$m3)*$dt/6
  ));

}

if($jsonify){
  echo json_encode($results);
} else {
  echo array2csv($results);
}

?>
